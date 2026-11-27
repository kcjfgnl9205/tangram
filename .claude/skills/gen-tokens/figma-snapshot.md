# Figma 변수 → `tokens/` 스냅샷 정규화

`gen-tokens` §3에서 쓰는 참고 문서. MCP `get_variable_defs`가 준 **이름 → 해석된 값** 맵을
Token Studio multiple-files 형식으로 옮기는 규칙이다 (`docs/adr/0013`).

## 왜 추론이 필요한가

`get_variable_defs`는 이런 형태만 준다:

```json
{ "bg/default": "#ffffff", "spacing/md": "16px", "font/body": "Inter" }
```

즉 **컬렉션·모드·타입 메타데이터가 없다.** Token Studio export에 있던 `$type`을 우리가 복원해야
하고, 모드는 **모드별 프레임을 각각 조회**해 얻는다. 추론이 애매하면 **추측하지 말고 확인한다.**

## 파일 레이아웃

| 파일                       | 내용                                                    |
| -------------------------- | ------------------------------------------------------- |
| `$metadata.json`           | `{ "tokenSetOrder": ["core", "light", "dark"] }`        |
| `$themes.json`             | `[]` — 스크립트가 `tokenSetOrder` 폴백을 지원           |
| `core.json`                | light/dark에서 **값이 같은** 변수 (원시 토큰)           |
| `light.json` / `dark.json` | light/dark에서 **값이 다른** 변수 (시맨틱). **키 동일** |
| `.figma-source.json`       | 출처 기록 (커밋 대상, 파이프라인 입력 아님)             |

분류 규칙: light 맵과 dark 맵을 변수명으로 조인해 값이 같으면 `core.json`, 다르면
`light.json`/`dark.json` 양쪽에 **같은 키**로 넣는다. 한쪽 맵에만 있는 변수는 커버리지 누락
신호다 — 값을 만들지 말고 사용자에게 보고한다.

## 이름 변환

Figma 변수 경로의 `/`를 JSON 중첩으로 바꾼다. 그 외 이름은 **바꾸지 않는다** (Tailwind 유틸
이름이 토큰 키를 그대로 따르므로, 개명은 디자이너와 합의된 경우에만).

```
"bg/surface/raised" → { "bg": { "surface": { "raised": { "$value": …, "$type": "color" } } } }
```

## `$type` 추론

**경로 접두사 우선, 값 형태는 보조**로 판단한다. 접두사 규칙은 디자이너와 합의해 두면 추론이
필요 없어진다.

| 경로 접두사 예시                                      | 값 형태                            | `$type`         |
| ----------------------------------------------------- | ---------------------------------- | --------------- |
| `color/`, `bg/`, `fg/`, `border/`, `icon/`, `accent/` | `#rrggbb`, `rgba(...)`, `hsl(...)` | `color`         |
| `spacing/`, `space/`, `gap/`, `size/`                 | `16px`, `1rem`                     | `spacing`       |
| `radius/`, `borderRadius/`, `corner/`                 | `8px`, `9999px`, `50%`             | `borderRadius`  |
| `font/`, `fontFamily/`, `family/`                     | 문자열 (`"Inter"`)                 | `fontFamilies`  |
| `fontSize/`, `text/`, `type/`                         | `14px`, `0.875rem`                 | `fontSizes`     |
| `fontWeight/`, `weight/`                              | `400`~`900`, `bold`                | `fontWeights`   |
| `lineHeight/`, `leading/`                             | `1.5`, `24px`, `150%`              | `lineHeights`   |
| `letterSpacing/`, `tracking/`                         | `-0.02em`, `0.5px`                 | `letterSpacing` |
| `shadow/`, `elevation/`                               | `0 1px 2px rgba(...)`              | `boxShadow`     |

- **표에 없는 것은 스킵**한다: `opacity/`, `borderWidth/`, `paragraphSpacing/`, 그리고 복합
  `typography` (SKILL의 "스킵되는 타입" 참고).
- 접두사와 값 형태가 **모순되면** (예: `spacing/md`의 값이 `#fff`) 추론하지 않고 그 변수를
  사용자에게 보고한다.
- 접두사가 표에 없고 값 형태만으로도 갈리지 않으면 (예: `brand/x: 12px` — spacing? radius?)
  스냅샷에서 제외하고 디자이너에게 확인한다. **틀린 네임스페이스는 잘못된 유틸을 만든다.**

## 값 정규화

- 색: 소문자 hex 유지. 알파가 있으면 `rgba(...)` 문자열 그대로.
- 치수: px/rem 단위를 **그대로 유지**한다 (임의 변환 금지 — sd-transforms가 처리).
- `lineHeights`의 `%`, `letterSpacing`의 `em`도 그대로 둔다.
- **alias 복원(선택)**: 시맨틱 값이 `core.json`의 어떤 토큰 값과 **정확히 일치하고 후보가
  하나뿐**이면 `{colors.gray.300}` 형태 참조로 되돌린다. 후보가 둘 이상이면 **리터럴 값을
  유지**한다 (잘못 연결하는 것보다 낫다).

## 예시

`core.json`

```json
{
  "spacing": { "md": { "$value": "16px", "$type": "spacing" } },
  "radius": { "lg": { "$value": "12px", "$type": "borderRadius" } }
}
```

`light.json` / `dark.json` — 키 동일, 값만 다름

```json
{ "bg": { "default": { "$value": "#ffffff", "$type": "color" } } }
```

```json
{ "bg": { "default": { "$value": "#0b0b0c", "$type": "color" } } }
```

`.figma-source.json`

```json
{
  "fileKey": "AbC123...",
  "nodes": { "light": "1:234", "dark": "1:567" },
  "fetchedAt": "2026-08-04",
  "variableCount": { "core": 42, "light": 31, "dark": 31 },
  "method": "figma-mcp:get_variable_defs"
}
```
