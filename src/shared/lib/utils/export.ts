// JSON Blob 생성
export const generateJsonBlob = (data: unknown): Blob => {
  const jsonString = JSON.stringify(data, null, 2)
  return new Blob([jsonString], { type: 'application/json' })
}

// SVG answer-area → PNG Blob 변환
// NOTE: 페이지에 아이콘 등 다른 SVG 가 있을 수 있으므로 반드시 '.canvas' 클래스로 특정.
export const generateAnswerAreaPng = async (
  svgSelector = 'svg.canvas',
  areaSelector = 'g.answer-area',
): Promise<Blob> => {
  const svg = document.querySelector(svgSelector)
  if (!svg) throw new Error(`SVG element not found: ${svgSelector}`)
  const answerArea = svg.querySelector(areaSelector)
  if (!answerArea) throw new Error(`Answer area not found: ${areaSelector}`)
  const [x, y, width, height] = svg.getAttribute('viewBox')?.split(' ') ?? []
  if (!width || !height) throw new Error('SVG viewBox is missing')

  // 새로운 svg 문자열 생성
  const newSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${Number(width) / 2} ${Number(height)}">
      ${answerArea.outerHTML}
    </svg>
  `

  const blobSvg = new Blob([newSvg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blobSvg)

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = Number(width) / 2
      canvas.height = Number(height)
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
