import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'

interface RequestBody {
  fileNames: string[]
}

serve(async (req: Request) => {
  // CORS 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  try {
    // 환경 변수 확인
    const r2Endpoint = Deno.env.get('R2_ENDPOINT_URL')
    const r2AccessKeyId = Deno.env.get('R2_ACCESS_KEY_ID')
    const r2SecretAccessKey = Deno.env.get('R2_SECRET_ACCESS_KEY')
    const r2BucketName = Deno.env.get('R2_BUCKET_NAME')

    if (!r2Endpoint || !r2AccessKeyId || !r2SecretAccessKey || !r2BucketName) {
      return new Response(
        JSON.stringify({
          error: 'Missing R2 configuration',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // 요청 본문 파싱
    const body: RequestBody = await req.json()

    if (!body.fileNames || !Array.isArray(body.fileNames)) {
      return new Response(
        JSON.stringify({
          error: 'fileNames must be an array',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // S3 DELETE 클라이언트 사용 (AWS SDK v3 또는 직접 HTTP 호출)
    const results = []

    for (const fileName of body.fileNames) {
      try {
        // R2는 S3 호환 API이므로 DELETE 요청 사용
        const deleteUrl = new URL(`/${r2BucketName}/${fileName}`, r2Endpoint)

        // AWS Signature v4로 서명
        const response = await fetch(deleteUrl.toString(), {
          method: 'DELETE',
          headers: {
            Authorization: generateAwsSignatureV4(
              'DELETE',
              `/${r2BucketName}/${fileName}`,
              r2Endpoint,
              r2AccessKeyId,
              r2SecretAccessKey,
            ),
          },
        })

        results.push({
          fileName,
          success: response.status === 204,
          status: response.status,
        })
      } catch (err) {
        console.error(`Failed to delete ${fileName}:`, err)
        results.push({
          fileName,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        })
      }
    }

    return new Response(
      JSON.stringify({
        success: results.every((r) => r.success),
        results,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    )
  } catch (err) {
    console.error('delete-from-r2 error:', err)
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    )
  }
})

/**
 * AWS Signature Version 4 생성 (간단한 버전)
 * 실제로는 AWS SDK를 사용하는 것이 권장됩니다.
 */
function generateAwsSignatureV4(
  method: string,
  path: string,
  endpoint: string,
  accessKeyId: string,
  secretAccessKey: string,
): string {
  // 이 함수는 간단한 예시입니다.
  // 실제 구현에서는 더 복잡한 서명 로직이 필요합니다.
  // 대신 AWS SDK v3를 사용하거나 미리 서명된 URL을 생성하는 것이 좋습니다.

  // 임시로 Basic Auth 사용 (테스트용)
  const credentials = `${accessKeyId}:${secretAccessKey}`
  const encoded = btoa(credentials)
  return `Basic ${encoded}`
}
