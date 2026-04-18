export async function uploadViaSupabase(fileBlob: Blob, fileName: string, contentType: string) {
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

    const arrayBuffer = await fileBlob.arrayBuffer()
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    )
  
  const res = await fetch(`${supabaseUrl}/functions/v1/upload-to-r2`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${supabasePublishableKey}`,
    },
    body: JSON.stringify({
      fileName,
      contentType,
      fileBody: base64String,
    }),
  })

  if (!res.ok) throw new Error(`R2 업로드 실패 (${res.status})`)
  
  const data = await res.json()
  return data
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
