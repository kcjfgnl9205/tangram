import jsPDF from 'jspdf'
import { useCanvasStore } from '@/entities/canvas'
import { getPath } from './utils'

// 템플릿 타입 정의
export interface PdfTemplate {
  name: string
  layout: 'grid' | 'circle' | 'line' | 'custom'
  positions: Array<{
    x: number
    y: number
    rotate?: number
  }>
  background?: string
  title?: string
}

// 기본 템플릿들
export const PDF_TEMPLATES: PdfTemplate[] = [
  {
    name: '격자 배치',
    layout: 'grid',
    positions: [
      { x: 200, y: 200 },
      { x: 400, y: 200 },
      { x: 600, y: 200 },
      { x: 200, y: 400 },
      { x: 400, y: 400 },
      { x: 600, y: 400 },
      { x: 400, y: 600 },
    ],
  },
  {
    name: '원형 배치',
    layout: 'circle',
    positions: [
      { x: 400, y: 150 },
      { x: 550, y: 250 },
      { x: 550, y: 450 },
      { x: 400, y: 550 },
      { x: 250, y: 450 },
      { x: 250, y: 250 },
      { x: 400, y: 350 },
    ],
  },
  {
    name: '직선 배치',
    layout: 'line',
    positions: [
      { x: 150, y: 300 },
      { x: 250, y: 300 },
      { x: 350, y: 300 },
      { x: 450, y: 300 },
      { x: 550, y: 300 },
      { x: 650, y: 300 },
      { x: 750, y: 300 },
    ],
  },
]

// 도형을 템플릿 위치로 재배치하는 함수
export const applyTemplateToObjects = (objects: any[], template: PdfTemplate): any[] => {
  const tangramObjects = objects.filter((obj) => obj.type === 'tangram')
  const otherObjects = objects.filter((obj) => obj.type !== 'tangram')

  const repositionedTangrams = tangramObjects.map((obj, index) => {
    const position = template.positions[index % template.positions.length]
    return {
      ...obj,
      x: position.x,
      y: position.y,
      rotate: position.rotate || 0,
    }
  })

  return [...otherObjects, ...repositionedTangrams]
}

// 템플릿 기반 SVG 생성 함수
export const generateTemplatedSvg = (
  originalSvg: Element,
  template: PdfTemplate,
  objects: any[],
): string => {
  const templatedObjects = applyTemplateToObjects(objects, template)

  // SVG 복제
  const newSvg = originalSvg.cloneNode(true) as SVGElement

  // 기존 객체들 제거
  const existingObjects = newSvg.querySelectorAll('.item')
  existingObjects.forEach((obj) => obj.remove())

  // 새로운 객체들 추가
  const problemArea = newSvg.querySelector('.problem-area')
  if (problemArea) {
    templatedObjects
      .filter((obj) => obj.type === 'tangram')
      .forEach((obj) => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
        g.setAttribute('class', 'item')
        g.setAttribute('transform', `translate(${obj.x}, ${obj.y}) rotate(${obj.rotate})`)

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('d', getPath(obj.coordinates))
        path.setAttribute('fill', `var(--theme-${obj.tangramType})`)
        path.setAttribute('stroke', `var(--theme-${obj.tangramType})`)
        path.setAttribute('stroke-width', '0')

        g.appendChild(path)
        problemArea.appendChild(g)
      })
  }

  return new XMLSerializer().serializeToString(newSvg)
}

// JSON Blob 생성
export const generateJsonBlob = (data: unknown): Blob => {
  const jsonString = JSON.stringify(data, null, 2)
  return new Blob([jsonString], { type: 'application/json' })
}

// playground 모드 — problem-area 의 7조각을 단색(#333) 실루엣으로 PNG 생성
// 정사각 viewBox 기준 그대로 렌더하여 썸네일로 사용
export const generatePlaygroundPng = async (
  svgSelector = 'svg.canvas',
  areaSelector = 'g.problem-area',
  fillColor = '#333333',
): Promise<Blob> => {
  const svg = document.querySelector(svgSelector)
  if (!svg) throw new Error(`SVG element not found: ${svgSelector}`)
  const area = svg.querySelector(areaSelector) as SVGGraphicsElement | null
  if (!area) throw new Error(`Area not found: ${areaSelector}`)
  const [x, y, width, height] = svg.getAttribute('viewBox')?.split(' ') ?? []
  if (!width || !height) throw new Error('SVG viewBox is missing')

  // 클론 후 모든 path 의 fill/stroke 를 단색으로 통일
  const cloned = area.cloneNode(true) as SVGElement
  // 선택 시 표시되는 회전 핸들(.rotate) 등 비-조각 UI 는 제거
  cloned.querySelectorAll('.rotate, .toolbar').forEach((el) => el.remove())
  cloned.querySelectorAll('path').forEach((el) => {
    el.setAttribute('fill', fillColor)
    el.setAttribute('stroke', fillColor)
    el.removeAttribute('style')
    el.removeAttribute('stroke-width')
  })

  const newSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${width} ${height}">${cloned.outerHTML}</svg>`
  const blobSvg = new Blob([newSvg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(blobSvg)

  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = Number(width)
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

// SVG 문자열 → PNG dataURL
// NOTE: <img> 로 로드할 때 SVG 에 width/height 가 없으면 기본 300x150 으로 잡혀
// 캔버스에 축소 렌더링되므로, drawImage 에 명시 크기를 넘겨 viewBox 를 캔버스에 맞춤.
const svgStringToPngDataUrl = (
  svgString: string,
  width: number,
  height: number,
  scale = 2,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width * scale
      canvas.height = height * scale
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = (e) => {
      URL.revokeObjectURL(url)
      reject(e)
    }
    img.src = url
  })
}

// PDF 페이지 안에 이미지를 비율 유지하며 가운데 배치
const addImageContain = (
  pdf: jsPDF,
  dataUrl: string,
  aspect: number,
  pageW: number,
  pageH: number,
  margin: number,
) => {
  let imgW = pageW - margin * 2
  let imgH = imgW / aspect
  if (imgH > pageH - margin * 2) {
    imgH = pageH - margin * 2
    imgW = imgH * aspect
  }
  const x = (pageW - imgW) / 2
  const y = (pageH - imgH) / 2
  pdf.addImage(dataUrl, 'PNG', x, y, imgW, imgH)
}

// SVG 단위 → 물리 mm 변환 — 페이지2 viewBox(990) 가 A4 가로 사용가능폭(190mm) 에 맞춰지므로
// 두 페이지 모두 이 비율로 환산해야 silhouette 과 조각의 물리 사이즈가 일치
const PAGE_USABLE_W_MM = 190
const PAGE_USABLE_H_MM = 277
const PIECES_VIEWBOX = 990
const MM_PER_SVG_UNIT = PAGE_USABLE_W_MM / PIECES_VIEWBOX

const escapeHtml = (s: string) =>
  s.replace(
    /[<>&"']/g,
    (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' })[c] as string,
  )

// 현재 적용된 테마 색상 읽기 (base.css 의 [data-theme="..."] 변수)
const readThemeColors = () => {
  const cs = getComputedStyle(document.documentElement)
  const get = (name: string) => cs.getPropertyValue(name).trim()
  return {
    board: get('--theme-board'),
    border: get('--theme-border'),
    outline: get('--theme-outline'),
    tangram: [
      get('--theme-tangram01'),
      get('--theme-tangram02'),
      get('--theme-tangram03'),
      get('--theme-tangram04'),
      get('--theme-tangram05'),
      get('--theme-tangram06'),
      get('--theme-tangram07'),
    ],
  }
}
type ThemeColors = ReturnType<typeof readThemeColors>

// Page 1: 워크시트 HTML 을 off-screen 에 마운트 (html2canvas 로 캡처할 대상)
const buildAnswerWorksheetEl = (
  canvasSvg: Element,
  title: string,
  theme: ThemeColors,
): { container: HTMLDivElement; mount: HTMLElement } => {
  const answerArea = canvasSvg.querySelector('g.answer-area') as SVGGraphicsElement | null
  if (!answerArea) throw new Error('Answer area not found: g.answer-area')

  // 실루엣 실제 bounding box 측정 → 페이지2 와 동일한 mm 스케일로 환산
  const bbox = answerArea.getBBox()
  const silWmm = bbox.width * MM_PER_SVG_UNIT
  const silHmm = bbox.height * MM_PER_SVG_UNIT

  // 실루엣 채움 — 테마 outline 색상으로 진하게
  const cloned = answerArea.cloneNode(true) as SVGElement
  cloned.querySelectorAll('.answer-board').forEach((el) => {
    el.setAttribute('fill', theme.outline)
    el.setAttribute('stroke', theme.outline)
    el.setAttribute('stroke-width', '6')
    el.setAttribute('stroke-linejoin', 'round')
    el.setAttribute('stroke-linecap', 'round')
  })

  const silhouetteSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}" style="width:${silWmm}mm;height:${silHmm}mm;display:block" preserveAspectRatio="xMidYMid meet">${cloned.outerHTML}</svg>`

  const t = escapeHtml(title)
  const html = `
    <div data-worksheet style="width:${PAGE_USABLE_W_MM}mm;height:${PAGE_USABLE_H_MM}mm;padding:8mm;box-sizing:border-box;display:flex;flex-direction:column;font-family:'Pretendard Variable',Pretendard,system-ui,sans-serif;color:${theme.outline};background:#ffffff;">
      <header style="display:flex;justify-content:space-between;align-items:end;margin-bottom:4mm;flex-shrink:0;">
        <div style="font-size:9mm;font-weight:700;color:${theme.outline};">${t}</div>
        <div style="display:flex;font-size:5mm;font-weight:600;color:#000000;">
          <span>이름:</span>
          <span style="display:inline-block;width:55mm;"></span>
        </div>
      </header>
      <div style="border:0.5mm solid ${theme.outline};border-radius:6mm;padding:8mm;display:flex;align-items:center;justify-content:center;flex:1;min-height:0;box-sizing:border-box;">${silhouetteSvg}</div>
    </div>`

  const container = document.createElement('div')
  // off-screen 마운트 — display:none 은 getBBox/렌더가 안 되므로 위치만 옮김
  container.style.position = 'fixed'
  container.style.left = '-99999px'
  container.style.top = '0'
  container.style.zIndex = '-1'
  container.innerHTML = html
  document.body.appendChild(container)

  const mount = container.querySelector('[data-worksheet]') as HTMLElement
  return { container, mount }
}

const captureWorksheetPng = async (
  mount: HTMLElement,
  scale = 2,
): Promise<{ dataUrl: string; widthPx: number; heightPx: number }> => {
  const html2canvas = (await import('html2canvas')).default
  const canvas = await html2canvas(mount, {
    scale,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
  })
  return {
    dataUrl: canvas.toDataURL('image/png'),
    widthPx: canvas.width,
    heightPx: canvas.height,
  }
}

// Page 2: 칠교판 7조각 — 정사각형 표준 정렬, 테마 outline 색상으로 가위질 가이드
// pageW/pageH 는 답안 페이지와 동일한 viewBox 사이즈를 받아 같은 SVG단위→물리 스케일을
// 사용하도록 한다. size 는 답안과 동일한 스케일을 위해 실제 로드된 조각의 좌표에서 역산.
const buildTangramPiecesPageSvg = (
  pageW: number,
  pageH: number,
  size: number,
  theme: ThemeColors,
): { svgString: string; w: number; h: number } => {
  const max = size / 2
  const mid = size / 4
  const min = size / 8
  const ws = mid + min
  // 정사각형 칠교판을 페이지 가운데 배치
  const cx = pageW / 2
  const cy = pageH / 2

  // tangram.ts 의 기본 좌표/위치와 동일 — 색상은 현재 테마(--theme-tangram01..07) 적용
  const pieces: Array<{ x: number; y: number; coords: number[][]; fill: string }> = [
    {
      x: cx,
      y: cy - mid,
      coords: [
        [-max, -mid],
        [max, -mid],
        [0, mid],
      ],
      fill: theme.tangram[0],
    },
    {
      x: cx + mid,
      y: cy,
      coords: [
        [mid, max],
        [mid, -max],
        [-mid, 0],
      ],
      fill: theme.tangram[1],
    },
    {
      x: cx - ws,
      y: cy - mid,
      coords: [
        [-min, -mid],
        [-min, mid],
        [min, 0],
      ],
      fill: theme.tangram[2],
    },
    {
      x: cx - mid,
      y: cy,
      coords: [
        [0, -mid],
        [-mid, 0],
        [0, mid],
        [mid, 0],
      ],
      fill: theme.tangram[3],
    },
    {
      x: cx,
      y: cy + min,
      coords: [
        [-mid, min],
        [0, -min],
        [mid, min],
      ],
      fill: theme.tangram[4],
    },
    {
      x: cx - mid,
      y: cy + mid,
      coords: [
        [-mid, -mid],
        [-mid, mid],
        [mid, mid],
      ],
      fill: theme.tangram[5],
    },
    {
      x: cx + min,
      y: cy + ws,
      coords: [
        [-ws, -min],
        [min, -min],
        [ws, min],
        [-min, min],
      ],
      fill: theme.tangram[6],
    },
  ]

  let body = `<rect x="${cx - max}" y="${cy - max}" width="${size}" height="${size}" fill="none" stroke="${theme.outline}" stroke-width="2"/>`
  for (const p of pieces) {
    body += `<g transform="translate(${p.x}, ${p.y})">`
    body += `<path d="${getPath(p.coords)}" fill="${p.fill}" stroke="${theme.outline}" stroke-width="2" stroke-linejoin="round"/>`
    body += `</g>`
  }

  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${pageW}" height="${pageH}" viewBox="0 0 ${pageW} ${pageH}">${body}</svg>`
  return { svgString, w: pageW, h: pageH }
}

// Canvas SVG를 PDF로 다운로드 (2페이지: 답안 + 잘라쓰는 칠교판)
export const downloadCanvasPdf = async (
  filename: string = '칠교놀이.pdf',
  svgSelector = 'svg.canvas',
): Promise<void> => {
  try {
    const svg = document.querySelector(svgSelector)
    if (!svg) throw new Error(`SVG element not found: ${svgSelector}`)

    const title = filename.replace(/\.pdf$/i, '')
    const theme = readThemeColors()

    // Page 1: HTML 워크시트 → html2canvas 로 PNG 캡처
    const { container, mount } = buildAnswerWorksheetEl(svg, title, theme)
    let answerCapture: { dataUrl: string; widthPx: number; heightPx: number }
    try {
      answerCapture = await captureWorksheetPng(mount, 2)
    } finally {
      container.remove()
    }

    // Page 2: 퍼즐 별로 admin 에서 tangramSize 를 다르게 설정할 수 있고 detail 페이지 store 에는
    // 반영되지 않으므로(default 500 고정), 실제 로드된 조각 좌표에서 size 를 역산
    const canvasStore = useCanvasStore()
    const tangrams = canvasStore.originalObjects.filter((o) => o.type === 'tangram')
    const absVals = tangrams
      .flatMap((t) => t.coordinates)
      .flat()
      .map(Math.abs)
    const inferredSize = absVals.length ? Math.max(...absVals) * 2 : 500

    // viewBox 990 고정 → A4 너비 190mm 매핑 → 페이지1 silhouette 과 동일 mm 스케일
    const pieces = buildTangramPiecesPageSvg(PIECES_VIEWBOX, PIECES_VIEWBOX, inferredSize, theme)
    const piecesPng = await svgStringToPngDataUrl(pieces.svgString, pieces.w, pieces.h)

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = pdf.internal.pageSize.getWidth()
    const pageH = pdf.internal.pageSize.getHeight()
    const margin = 10

    // Page 1: 워크시트는 명시적 PAGE_USABLE_W_MM(190mm) 폭으로 렌더되었으므로 동일 폭으로 추가
    const p1W = PAGE_USABLE_W_MM
    const p1H = (answerCapture.heightPx / answerCapture.widthPx) * p1W
    pdf.addImage(answerCapture.dataUrl, 'PNG', margin, margin, p1W, p1H)

    pdf.addPage()
    addImageContain(pdf, piecesPng, pieces.w / pieces.h, pageW, pageH, margin)

    pdf.save(filename)
  } catch (error) {
    console.error('PDF 다운로드 실패:', error)
    throw error
  }
}
