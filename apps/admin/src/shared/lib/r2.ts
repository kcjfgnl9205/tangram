/**
 * R2 업로드 — Supabase Edge Function(upload-to-r2) 을 거친다.
 * R2 시크릿은 Edge Function 환경변수에만 있고 브라우저로 내려오지 않는다.
 *
 * 서비스 앱의 shared/lib/r2/upload.ts 와 같은 계약을 쓴다.
 */

const MAX_UPLOAD_BYTES = 2 * 1024 * 1024 // 2MB — 로고는 이보다 클 이유가 없다
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'] as const

export interface UploadResult {
  /** DB 에 저장할 경로. getResourceUrl() 로 공개 주소를 만든다 */
  fileName: string
}

/** 브라우저에서 바로 거를 수 있는 것은 네트워크를 타기 전에 거른다 */
export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type as (typeof ALLOWED_TYPES)[number])) {
    return 'PNG · JPG · WEBP · SVG 파일만 올릴 수 있습니다'
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return `파일이 너무 큽니다 (최대 ${MAX_UPLOAD_BYTES / 1024 / 1024}MB)`
  }
  return null
}

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    // readAsDataURL 은 큰 파일에서도 콜스택을 터뜨리지 않는다.
    // (String.fromCharCode(...bytes) 방식은 수백 KB 부터 RangeError 가 난다)
    reader.onload = () => resolve(String(reader.result).replace(/^data:.*;base64,/, ''))
    reader.onerror = () => reject(new Error('파일을 읽지 못했습니다'))
    reader.readAsDataURL(file)
  })

export async function uploadToR2(file: File, dir = 'shop'): Promise<UploadResult> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

  const ext = file.name.includes('.') ? file.name.split('.').pop()!.toLowerCase() : 'png'
  // 원본 파일명을 그대로 쓰면 한글·공백 때문에 경로가 깨진다
  const fileName = `${dir}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const res = await fetch(`${supabaseUrl}/functions/v1/upload-to-r2`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({
      fileName,
      contentType: file.type,
      fileBody: await toBase64(file),
    }),
  })

  if (!res.ok) throw new Error(`업로드 실패 (${res.status})`)

  const data = (await res.json()) as Partial<UploadResult>
  if (!data.fileName) throw new Error('업로드 응답에 경로가 없습니다')
  return { fileName: data.fileName }
}
