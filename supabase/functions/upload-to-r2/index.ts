// supabase functions deploy upload-to-r2함수배포
// @ts-nocheck
import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { AwsClient } from "npm:aws4fetch"

serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  }

  // ✅ Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { fileName, contentType, fileBody } = await req.json()

    const ACCOUNT_ID = Deno.env.get("VITE_R2_ACCOUNT_ID")!
    const ACCESS_KEY = Deno.env.get("VITE_R2_ACCESS_KEY")!
    const SECRET_KEY = Deno.env.get("VITE_R2_SECRET_KEY")!
    const BUCKET = Deno.env.get("VITE_R2_BUCKET")!

    const aws = new AwsClient({
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
      region: "auto",
      service: "s3",
    })

    const endpoint = `https://${ACCOUNT_ID}.r2.cloudflarestorage.com/${BUCKET}/${fileName}`
    const safeBase64 = fileBody.replace(/^data:.*;base64,/, "") // ⚠️ data: prefix 제거
    const buffer = Uint8Array.from(atob(safeBase64), c => c.charCodeAt(0))

    const res = await aws.fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: buffer,
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`R2 upload failed: ${text}`)
    }

    return new Response(
      JSON.stringify({
        message: "Upload success",
        url: endpoint,
        fileName
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    )
  } catch (err) {
    console.error("Edge Function Error:", err)
    return new Response("Internal Server Error", { status: 500, headers: corsHeaders })
  }
})
