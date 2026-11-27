# 0010. Token Studio export에서 디자인 토큰 생성

- 상태: superseded by [0013](0013-design-tokens-from-figma-mcp.md)
- 날짜: 2026-06-18
- 결정자: 프론트엔드 팀

## 배경 (Context)

디자인 토큰(색상·간격·radius·타이포)을 디자이너가 Figma에서 관리하고, 프론트엔드는
이를 Tailwind에 반영해야 한다. 라이브 Figma 동기화(MCP)는 매번 결과가 달라지고 리뷰가
어렵다. 반대로 토큰을 손으로 베껴 적으면 휴먼 에러와 드리프트가 생긴다.

디자이너는 이미 **Tokens Studio for Figma** 플러그인으로 토큰을 관리하며, "multiple
files" 형식으로 export할 수 있다. 우리는 이 export를 단일 진실 소스(SSOT)로 삼고,
`schema.d.ts`(`docs/adr/0005`)처럼 **커밋된 입력 → 스크립트 → 생성물** 파이프라인을
원한다.

## 결정 (Decision)

Token Studio의 multiple-files export를 리포에 커밋하고, 스크립트로 Tailwind v4 토큰을
생성한다.

- **원본 입력**: 디자이너 export를 리포 루트 `tokens/`에 둔다. 손대지 않는 입력
  아티팩트이므로 export 그대로 보존한다 (Prettier 제외).
  - `$metadata.json` — 토큰 세트 순서(`tokenSetOrder`)
  - `$themes.json` — 테마 정의. **비어 있어도(`[]`) 동작**한다 (아래 light/dark 결정 참고).
  - `core.json` — 원시(primitive) 토큰 (colors/spacing/borderRadius/fontSizes …)
  - `light.json` / `dark.json` — 모드별 **시맨틱** 토큰(`fg`, `bg`, `accent` …). core를
    `{colors.gray.300}` 식으로 참조한다. 두 파일은 **같은 키**를 가져야 다크에서 같은
    변수를 덮어쓴다.
  - (선택) `theme.json` 등 컴포넌트 토큰 세트.
- **light/dark 결정**: `$themes.json`에 테마가 구성돼 있으면 Light/Dark 테마에서 세트를
  유도한다. **비어 있으면 `$metadata.json`의 `tokenSetOrder`로 폴백**해, 이름이 정확히
  `light`/`dark`인 세트를 스킴 세트로 본다. (디자이너가 플러그인에서 테마를 구성하지 않은
  기본 export도 그대로 동작시키기 위함.)
- **변환**: `scripts/build-tokens.mjs`가 **Style Dictionary + `@tokens-studio/sd-transforms`**로
  참조/수식(`{a} * {b}`)/alias/`rgba({color}, a)`를 해석한다. `npm run gen:tokens`로 실행.
- **네임스페이스 매핑은 그룹명이 아니라 토큰 `$type` 기준**이다. 그룹명이 Tailwind와
  달라도(`colors`, `borderRadius` …) 올바른 네임스페이스로 들어간다. sd-transforms가 타입을
  손실 정규화(borderRadius/spacing/letterSpacing → 모두 `dimension`)하므로, **원본 JSON에서
  읽은 원래 `$type`**으로 매핑한다:
  | `$type` | 네임스페이스 | | `$type` | 네임스페이스 |
  | --- | --- | --- | --- | --- |
  | color | `--color-*` | | fontWeights | `--font-weight-*` |
  | borderRadius | `--radius-*` | | lineHeights | `--leading-*` |
  | spacing | `--spacing-*` | | letterSpacing | `--tracking-*` |
  | fontFamilies | `--font-*` | | boxShadow | `--shadow-*` |
  | fontSizes | `--text-*` | | | |

  매핑에 없는 타입(`dimension` 원시·`paragraphSpacing`·`borderWidth`·`opacity`)과 복합
  타입(`typography`)은 **스킵**한다.

- **생성물**: `src/app/styles/tokens.css` (생성 파일, 손수정 금지, Prettier 제외).
  - base(light) + 원시 토큰 → `@theme { … }` (기본값)
  - dark 세트의 시맨틱 토큰만 → `@media (prefers-color-scheme: dark) { :root { … } }` 오버라이드
- **소비**: `main.css`가 `@import './tokens.css'`로 불러온다. Tailwind v4가 `@theme`
  변수에서 `bg-bg-default`, `text-fg-default`, `rounded-lg`, `shadow-default` 같은 유틸을
  자동 생성한다 (유틸 이름은 토큰 키를 따른다).

## 결과 (Consequences)

- 긍정적: 토큰이 버전관리/리뷰 대상이 되고, 변환이 결정적이다. 디자이너 export →
  `npm run gen:tokens` 한 번으로 동기화. 다크모드는 ADR 0008(`prefers-color-scheme`)과
  일관되게 자동 처리.
- 부정적 / 트레이드오프: devDependency 2개(`style-dictionary`, `@tokens-studio/sd-transforms`)
  추가. 복합 타입(`typography`)과 네임스페이스가 없는 타입은 자동 생성되지 않으므로, 그런
  토큰이 필요하면 컴포넌트 레이어에서 별도 처리한다. 유틸 이름이 토큰 키를 그대로 따르므로
  (`bg-bg-default` 등), 깔끔한 유틸을 원하면 토큰 키 네이밍을 디자이너와 합의하는 게 좋다.
- 후속 작업: 실제 디자이너 export로 교체되면 `tokens/`의 샘플을 덮어쓰고 `npm run gen:tokens`
  재실행. 토큰 세트가 늘면 `$metadata.json`/`$themes.json`만 반영되면 스크립트는 그대로 동작.

## 검토한 대안

- **라이브 Figma MCP 동기화** — 결과 비결정적, diff/리뷰 어려움, CI 재현 불가.
- **토큰 수기 입력(main.css에 직접 작성)** — 드리프트와 휴먼 에러. SSOT 부재.
- **경량 커스텀 변환 스크립트** — 의존성은 없지만 Token Studio의 alias/참조/수식 해석을
  직접 구현해야 해 토큰이 복잡해지면 깨지기 쉬움. Style Dictionary가 이를 검증된 형태로 제공.
