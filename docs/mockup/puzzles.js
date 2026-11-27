/* 목업용 더미 도안 데이터와 카드 렌더러.
   랜딩과 목록이 같은 카드를 쓰도록 한 곳에 모아 둔다.
   실제로는 tangrams 테이블에서 온다.
   file:// 로 열어도 동작하도록 모듈이 아닌 전역 스크립트로 둔다. */

/* 실루엣은 모든 변이 수평·수직·45° 로만 이뤄진다.
   칠교 일곱 조각으로 만들 수 있는 모양은 전부 이 조건을 만족하므로,
   각도가 어긋나면 한눈에 "칠교가 아닌 그림"으로 보인다. */
var SHAPES = {
  house: 'M50,6 L94,50 L82,50 L82,94 L18,94 L18,50 L6,50 Z',
  cat: 'M20,92 L20,50 L34,36 L34,20 L48,34 L62,34 L76,20 L76,36 L90,50 L90,92 L68,92 L68,64 L42,64 L42,92 Z',
  boat: 'M54,10 L54,58 L6,58 Z M8,64 L92,64 L64,92 L36,92 Z',
  rabbit:
    'M30,8 L42,8 L42,44 L58,44 L58,8 L70,8 L70,46 L84,60 L84,92 L16,92 L16,60 L30,46 Z',
  fish: 'M30,50 L58,22 L86,50 L58,78 Z M30,50 L6,26 L6,74 Z',
  runner:
    'M42,6 L58,6 L58,22 L42,22 Z M38,26 L62,26 L62,56 L38,56 Z M20,34 L38,34 L38,46 L20,46 Z M62,34 L82,34 L82,46 L62,46 Z M38,58 L50,58 L50,76 L32,94 L20,94 L38,76 Z M50,58 L62,58 L62,76 L80,94 L68,94 L50,76 Z',
  candle: 'M50,8 L72,30 L28,30 Z M30,34 L70,34 L70,94 L30,94 Z',
  fox: 'M6,92 L6,74 L26,54 L26,30 L44,48 L58,48 L76,30 L76,54 L90,68 L90,78 L74,78 L74,92 Z',
  swan: 'M16,92 L16,74 L34,56 L34,38 L48,24 L48,10 L62,24 L62,38 L80,56 L88,64 L88,92 Z',
  one: 'M40,26 L56,10 L62,10 L62,78 L76,78 L76,92 L26,92 L26,78 L40,78 Z',
  four: 'M58,12 L74,12 L74,92 L58,92 L58,70 L16,70 L16,54 Z',
  seven: 'M16,12 L84,12 L84,28 L50,62 L50,92 L30,92 L30,54 L64,20 L16,20 Z',
}

/* 난이도는 색만으로 구분하지 않는다 — 아이콘 모양이 함께 달라진다 */
var LEVEL = {
  easy: { label: '쉬움', icon: '<circle cx="12" cy="12" r="7.5" />' },
  normal: { label: '보통', icon: '<path d="M12 4 L20 12 L12 20 L4 12 Z" />' },
  hard: {
    label: '어려움',
    icon: '<path d="M12 3 L15 9 L21 10 L16.5 14.5 L18 21 L12 17.5 L6 21 L7.5 14.5 L3 10 L9 9 Z" />',
  },
}

var PUZZLES = {
  // 운영자가 승격한 공식 도안 — key 로 translation_meta 를 조회해 제목을 번역한다
  official: [
    { name: '집', shape: 'house', level: 'easy', cat: 'thing', views: 1240, dl: 312 },
    { name: '고양이', shape: 'cat', level: 'normal', cat: 'animal', views: 2110, dl: 489 },
    { name: '배', shape: 'boat', level: 'easy', cat: 'thing', views: 860, dl: 170 },
    { name: '토끼', shape: 'rabbit', level: 'normal', cat: 'animal', views: 1530, dl: 401 },
    { name: '물고기', shape: 'fish', level: 'easy', cat: 'animal', views: 990, dl: 208 },
    { name: '달리는 사람', shape: 'runner', level: 'hard', cat: 'people', views: 640, dl: 95 },
    { name: '촛불', shape: 'candle', level: 'easy', cat: 'thing', views: 720, dl: 143 },
    { name: '여우', shape: 'fox', level: 'hard', cat: 'animal', views: 580, dl: 88 },
    { name: '백조', shape: 'swan', level: 'hard', cat: 'animal', views: 430, dl: 61 },
    { name: '숫자 1', shape: 'one', level: 'easy', cat: 'number', views: 1810, dl: 702 },
    { name: '숫자 4', shape: 'four', level: 'normal', cat: 'number', views: 1120, dl: 530 },
    { name: '숫자 7', shape: 'seven', level: 'normal', cat: 'number', views: 1050, dl: 488 },
  ],
  // 사용자 생성 — key 가 없고 title 원문이 그대로 제목이 된다 (번역하지 않음)
  community: [
    { name: '내가 만든 로켓', shape: 'candle', level: 'normal', cat: 'thing', views: 42, dl: 3 },
    { name: '뚱뚱한 고양이', shape: 'cat', level: 'easy', cat: 'animal', views: 88, dl: 12 },
    { name: '아빠', shape: 'runner', level: 'hard', cat: 'people', views: 21, dl: 1 },
    { name: '우리집', shape: 'house', level: 'easy', cat: 'thing', views: 64, dl: 9 },
    { name: '상어다!!', shape: 'fish', level: 'normal', cat: 'animal', views: 130, dl: 18 },
    // title 이 비어 있을 때의 폴백이 실제로 어떻게 보이는지
    { name: '이름 없는 도안', shape: 'swan', level: 'hard', cat: 'animal', views: 7, dl: 0 },
    { name: '토끼야 안녕', shape: 'rabbit', level: 'easy', cat: 'animal', views: 55, dl: 6 },
    { name: '여우 비슷한거', shape: 'fox', level: 'normal', cat: 'animal', views: 33, dl: 2 },
  ],
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
  })
}

var EYE =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />' +
  '<circle cx="12" cy="12" r="2.6" /></svg>'

var PRINTER =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M6 9V3h12v6M6 18H4v-7h16v7h-2M8 15h8v6H8z" /></svg>'

/**
 * 도안 카드 하나.
 *
 * 카드 전체가 하나의 링크다 — 버튼을 따로 두지 않는다.
 * 줄이 쌓일수록 카드가 복잡해지므로 제목 한 줄, 정보 한 줄로 끝낸다.
 *
 * opts.checkKey — 인쇄 모드 체크박스의 키. 없으면 체크박스 없음
 * opts.checked  — 체크 상태
 */
function renderCard(p, opts) {
  opts = opts || {}
  var lv = LEVEL[p.level]
  var name = escapeHtml(p.name)

  // 체크박스는 링크 바깥에 둔다 — 링크 안에 넣으면 클릭이 서로 잡아먹는다
  var check =
    opts.checkKey != null
      ? '<input class="puzzle-card__check" type="checkbox" data-key="' +
        opts.checkKey +
        '" ' +
        (opts.checked ? 'checked' : '') +
        ' aria-label="' +
        name +
        ' 선택" />'
      : ''

  // 인쇄는 목록에서 바로 되어야 한다. 줄을 늘리지 않도록 썸네일 위에 얹는다.
  var printBtn =
    '<a class="puzzle-card__print" href="#" aria-label="' +
    name +
    ' 인쇄하기" title="인쇄하기">' +
    PRINTER +
    '</a>'

  return (
    '<article class="puzzle-card">' +
    check +
    printBtn +
    '<a class="puzzle-card__link" href="#">' +
    '<span class="puzzle-card__art">' +
    '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="' +
    SHAPES[p.shape] +
    '" fill="#16181D" /></svg></span>' +
    '<span class="puzzle-card__body">' +
    '<span class="puzzle-card__name">' +
    name +
    '</span>' +
    '<span class="puzzle-card__meta">' +
    '<span class="level"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linejoin="round" aria-hidden="true">' +
    lv.icon +
    '</svg>' +
    lv.label +
    '</span>' +
    '<span class="dot" aria-hidden="true"></span>' +
    '<span>' +
    EYE +
    '<span class="sr-only">조회수 </span>' +
    p.views.toLocaleString() +
    '</span>' +
    '<span>' +
    PRINTER +
    '<span class="sr-only">인쇄 </span>' +
    p.dl.toLocaleString() +
    '</span>' +
    '</span>' +
    '</span>' +
    '</a>' +
    '</article>'
  )
}
