---
name: gen-tokens
description: Figma MCP로 디자인 변수를 읽어 tokens/ 스냅샷으로 커밋하고, Tailwind v4 디자인 토큰(src/app/styles/tokens.css)을 재생성한다. 디자이너가 Figma에서 토큰을 바꿨거나, 색상/간격/radius/타이포 토큰을 동기화해야 할 때 사용.
---

# 디자인 토큰 생성

디자인 토큰을 **Figma에서 MCP로 직접 읽어** 동기화한다 (`docs/adr/0013` 참고. 이전의
디자이너 export 핸드오프 방식은 `docs/adr/0010` — 0013이 대체함).

흐름은 **MCP 조회 → `tokens/` 스냅샷 커밋 → 스크립트 → `tokens.css`**다. MCP는 **입력을
가져오는 단계에만** 쓴다. 빌드·CI는 커밋된 스냅샷만 보므로 Figma 인증 없이도 재현된다.

> **상태: 파이프라인 미설치 (재구성용 청사진).** 디자이너 토큰 확정 대기 중이라 실제
> 코드(`tokens/`, `scripts/build-tokens.mjs`, `gen:tokens` 스크립트, `tokens.css`,
> devDeps)는 제거된 상태입니다. 아래 절차로 재설치하세요:
>
> 1. `pnpm add -D -w style-dictionary @tokens-studio/sd-transforms`
> 2. `package.json`에 `"gen:tokens": "node scripts/build-tokens.mjs"` 추가
> 3. `scripts/build-tokens.mjs`를 `docs/adr/0010`의 설계(타입 기반 매핑·빈 `$themes` 폴백·
>    dark media 오버라이드)대로 작성 — **변환 단계는 0013에서도 그대로다**
> 4. `main.css`에 `@import './tokens.css'` 추가, `.prettierignore`에 `tokens`·`tokens.css` 추가
>
> MCP 조회는 에이전트 도구라 추가 의존성이 없다. 이후부터는 아래 흐름이 그대로 적용됩니다.

## 1. 입력 확인 (묻지 않고 추측하지 않는다)

필요한 것:

- 토큰(변수)이 정의된 **Figma design 파일 링크** (`figma.com/design/...`).
- **모드별 조회 대상** — light 프레임/페이지, dark 프레임/페이지. 모드가 하나면 하나만.

없으면 먼저 묻는다: "토큰이 정의된 **Figma 파일 링크**와, **light/dark 각각의 프레임**을
주세요." claude.ai Figma 커넥터 인증이 없으면 여기서 멈추고 인증을 요청하거나 §5 폴백으로 간다.

## 2. MCP로 변수 수집

- `get_metadata(fileKey)` — `nodeId` 없이 호출하면 페이지 목록이 나온다. 토큰 정의 페이지
  (`Foundations`·`Tokens`·`Colors` 등)를 찾아 대상 노드를 좁힌다.
- `get_variable_defs(fileKey, nodeId)` — `{'bg/default': '#ffffff', 'spacing/md': '16px'}`
  형태로 **해석된 실제 값**을 반환한다. 주의:
  - **그 노드에 실제로 적용된 변수만** 나온다. 토큰을 모두 사용하는 **쇼케이스 프레임**을
    대상으로 삼거나, 프레임을 나눠 여러 번 호출해 합친다. 커버리지가 의심되면 디자이너에게
    "토큰 전수 프레임"을 요청한다.
  - **모드별로 각각 호출**한다 → light 값 맵, dark 값 맵. 두 맵은 **같은 변수명**으로 대응된다.
- 변수가 외부 라이브러리에 있으면 `get_libraries(fileKey)`로 라이브러리 키를 얻고
  `search_design_system(query, fileKey, includeVariables: true, includeLibraryKeys: [...])`로 찾는다.
- **값을 지어내지 않는다.** 필요한 토큰이 조회 결과에 없으면 추정하지 말고 해당 변수를 쓰는
  노드/프레임을 요청한다. 어떤 변수를 못 가져왔는지 사용자에게 그대로 알린다.

## 3. `tokens/` 스냅샷 정규화

조회 결과를 **Token Studio multiple-files 형식**으로 `tokens/`에 쓴다 (형식이 같아 변환
스크립트는 그대로 동작). 파일별 역할·`$type` 추론 규칙·JSON 예시는 **`figma-snapshot.md`** 참고.

요약:

- light/dark 값이 **같은** 변수 → `core.json` (원시), **다른** 변수 → `light.json`/`dark.json`
  (시맨틱, **두 파일은 같은 키**여야 다크 오버라이드가 맞물린다).
- `$metadata.json`의 `tokenSetOrder` = `["core", "light", "dark"]`, `$themes.json` = `[]`
  (스크립트가 `tokenSetOrder` 폴백을 지원).
- `$type`은 **변수 경로 + 값 형태**로 추론한다 (`figma-snapshot.md` 매핑표). 애매하면 추측하지
  말고 디자이너에게 확인하고, 확인 전까지 해당 토큰은 스냅샷에서 뺀다.
- `tokens/.figma-source.json`에 `fileKey`·조회 노드 ID·조회 일자·변수 개수를 기록한다(재조회·감사용).

## 4. 토큰 재생성

```sh
pnpm run gen:tokens
```

- `scripts/build-tokens.mjs`(Style Dictionary + `@tokens-studio/sd-transforms`)가
  `src/app/styles/tokens.css`를 덮어쓴다 (생성 파일, 읽기 전용 — 손으로 수정 금지, Prettier 제외).
- 시맨틱 + 원시 토큰은 `@theme`로 나온다. **다크모드는 쓰지 않으므로 dark 오버라이드
  (`@media (prefers-color-scheme: dark)`)는 만들지 않는다** — Figma 에 dark 세트가 있어도 건너뛴다.
- `main.css`가 `@import './tokens.css'`로 소비하므로 별도 연결 작업은 없다.

### 매핑 규칙 (토큰 `$type` 기준)

네임스페이스는 그룹명이 아니라 **토큰 `$type`**으로 결정된다. 유틸 이름은 토큰 키를 따른다.

| `$type`      | CSS 변수      | 유틸 예시        | `$type`       | CSS 변수          | 유틸 예시            |
| ------------ | ------------- | ---------------- | ------------- | ----------------- | -------------------- |
| color        | `--color-*`   | `bg-bg-default`  | fontWeights   | `--font-weight-*` | `font-heading-bold`  |
| borderRadius | `--radius-*`  | `rounded-lg`     | lineHeights   | `--leading-*`     | `leading-body`       |
| spacing      | `--spacing-*` | `p-md`, `gap-lg` | letterSpacing | `--tracking-*`    | `tracking-decreased` |
| fontFamilies | `--font-*`    | `font-body`      | boxShadow     | `--shadow-*`      | `shadow-default`     |
| fontSizes    | `--text-*`    | `text-h1`        |               |                   |                      |

- **스킵되는 타입**: `dimension`(원시 backing), `paragraphSpacing`, `borderWidth`, `opacity`,
  그리고 복합 타입 `typography`. (`typography`는 단일 CSS 변수로 못 만들어 `Unknown CSS Font
Shorthand` 경고가 뜨는데 정상 — 자동 생성 대상이 아님.)
- core 참조는 `{colors.gray.300}` alias·수식(`{a} * {b}`)·`rgba({color}, a)` 모두 스크립트가
  해석한다. MCP 조회는 값이 이미 해석돼 오므로 참조가 없어도 정상이다.

## 5. 검증 & 리뷰

- `pnpm run gen:tokens` 출력의 변수 개수(theme vars / dark overrides)를 확인.
- `pnpm run build`로 Tailwind가 `@theme`를 처리하고 사용 중인 토큰 유틸이 컴파일되는지 확인.
- **`tokens/` diff를 사람이 리뷰한다** — 스냅샷은 생성물이지만 커밋·리뷰 대상이다. 값이 예상 밖으로
  흔들렸거나 토큰이 대량으로 사라졌으면 커밋하지 말고 디자이너에게 확인한다(MCP 조회 프레임
  커버리지 문제일 가능성이 크다).
- 새 시맨틱 토큰을 쓰는 컴포넌트는 라이트/다크 양쪽 스크린샷으로 확인 권장.
- 커밋은 `prepare-commit`으로. 스냅샷(`tokens/`)과 생성물(`tokens.css`)을 한 커밋에 함께 담는다.

## 폴백 — MCP를 못 쓸 때

MCP 인증/권한이 없거나 디자이너가 Tokens Studio 플러그인으로 관리하는 경우:

1. 디자이너가 **Tokens Studio → Settings → "Multiple files"**로 export.
2. 받은 파일을 `tokens/`에 그대로 덮어쓴다 (`$metadata.json`·`$themes.json`·`core.json`·
   `light.json`·`dark.json`). 형식이 동일하므로 **§4부터 그대로 진행**된다.
3. 이 경우 `.figma-source.json`에 "export 수동 반영"과 전달받은 날짜를 남긴다.
