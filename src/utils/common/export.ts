// JSON Blob 생성
export const generateJsonBlob = (data: unknown): Blob => {
  const jsonString = JSON.stringify(data, null, 2)
  return new Blob([jsonString], { type: 'application/json' })
}

// SVG answer-area → PNG Blob 변환
export const generateAnswerAreaPng = async (
  svgSelector = 'svg',
  areaSelector = 'g.answer-area',
): Promise<Blob> => {
  const svg = document.querySelector(svgSelector)!
  const answerArea = svg.querySelector(areaSelector)!
  const vb = svg.getAttribute('viewBox')!

  // 새로운 svg 문자열 생성
  const newSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">
      ${answerArea.outerHTML}
    </svg>
  `

  const blobSvg = new Blob([newSvg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blobSvg)

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const [w, h] = vb.split(' ').slice(2).map(Number)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)

      canvas.toBlob((b) => {
        resolve(b!)
        URL.revokeObjectURL(url)
      }, 'image/png')
    }
    img.src = url
  })
}
