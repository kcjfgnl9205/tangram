# 0013. Figma MCP로 디자인 토큰 스냅샷을 동기화

- 상태: accepted
- 날짜: 2026-08-04
- 결정자: 프론트엔드 팀
- 대체 대상: [0010](0010-design-tokens-from-token-studio.md)

## 배경 (Context)

ADR 0010은 디자이너의 **Tokens Studio multiple-files export**를 리포에 커밋해 SSOT로 삼고,
스크립트로 Tailwind v4 토큰(`src/app/styles/tokens.css`)을 생성하기로 했다. 변환·생성물
쪽은 잘 동작하지만, **입력을 얻는 방식**에 문제가 있다:

- 디자이너가 플러그인에서 export를 수동으로 뽑아 파일로 전달하는 **핸드오프가 병목**이다.
  전달 누락·구버전 전달·세트 일부만 export 같은 사고가 생기고, 프론트는 받은 파일이 최신인지
  확인할 방법이 없다.
- 디자이너에게 **Tokens Studio 플러그인 사용을 강제**한다. 네이티브 **Figma Variables**만으로
  토큰을 관리하는 팀에는 맞지 않는다.
- 우리는 이미 **claude.ai Figma 커넥터(MCP)**로 디자인을 읽는다(`rules/37-figma-to-code`,
  `implement-from-figma`). 변수는 `get_variable_defs`로 해석된 실제 값을 조회할 수 있어,
  사람이 파일을 옮기는 단계 없이 같은 정보를 얻을 수 있다.

0010이 "라이브 Figma MCP 동기화"를 배제한 이유는 *비결정적 · diff/리뷰 어려움 · CI 재현
불가*였다. 이는 **MCP를 빌드 단계에 두었을 때** 생기는 문제다. MCP를 **입력 획득 단계에만**
두고 그 결과를 커밋된 스냅샷으로 고정하면 세 단점은 모두 사라진다. (CI에는 Figma 인증이
없으므로 빌드가 MCP에 의존해선 안 된다는 제약도 같은 결론을 가리킨다.)

## 결정 (Decision)

토큰의 **입력 획득을 Figma MCP로 전환**하고, **커밋된 스냅샷 → 스크립트 → 생성물** 파이프라인은
0010 그대로 유지한다.

- **입력 획득**: `gen-tokens` 스킬이 Figma MCP로 변수를 조회한다 — `get_metadata`로 토큰 정의
  프레임을 찾고, `get_variable_defs(fileKey, nodeId)`로 값을 읽고, 라이브러리 변수는
  `get_libraries` + `search_design_system(includeVariables)`로 찾는다. light/dark는 **모드별
  프레임을 각각 조회**해 같은 변수명끼리 대응시킨다.
- **스냅샷(커밋 대상)**: 조회 결과를 `tokens/`에 **Token Studio multiple-files 형식 그대로**
  정규화해 쓴다 — `$metadata.json`, `$themes.json`(빈 배열 허용), `core.json`,
  `light.json`, `dark.json`. 0010과 파일 형식이 동일하므로 변환 스크립트는 바뀌지 않는다.
  차이는 출처뿐이다: **디자이너 export가 아니라 MCP 조회 결과를 정규화한 스냅샷**이다.
  - light/dark 값이 **같은** 변수 → `core.json`(원시), **다른** 변수 → `light.json`/`dark.json`
    (시맨틱, 두 파일은 같은 키를 가진다).
  - **출처 기록**: `tokens/.figma-source.json`에 `fileKey`·조회한 노드 ID·조회 일자·변수 개수를
    남겨 재조회와 감사가 가능하게 한다.
- **변환·생성물·소비**: 0010과 동일하다. `scripts/build-tokens.mjs`(Style Dictionary +
  `@tokens-studio/sd-transforms`) → `src/app/styles/tokens.css`, 네임스페이스는 **토큰 `$type`
  기준** 매핑, dark 시맨틱은 `@media (prefers-color-scheme: dark)` 오버라이드,
  `main.css`가 `@import './tokens.css'`로 소비.
- **의존성 불변**: MCP는 에이전트 도구이므로 런타임/CI 의존성이 늘지 않는다.
  `pnpm run gen:tokens`와 `pnpm run build`는 **MCP 없이 커밋된 스냅샷만으로** 동작한다.
- **리뷰 게이트**: 스냅샷은 생성물이지만 **커밋·리뷰 대상**이다. `tokens/` diff를 PR에서 확인하고,
  값이 예상 밖으로 흔들리면 커밋하지 않고 디자이너에게 확인한다.
- **폴백 유지**: MCP 접근이 불가하거나 디자이너가 Tokens Studio를 쓰는 경우, export 파일을
  `tokens/`에 그대로 덮어쓰는 0010 흐름이 **형식이 같아 그대로 동작한다**. 기본 경로는 MCP다.

## 결과 (Consequences)

- 긍정적: 디자이너 파일 핸드오프가 사라져 "최신인가?"를 매번 확인할 필요가 없다. Tokens Studio
  플러그인 강제가 없어져 네이티브 Figma Variables 팀에도 적용된다. 스냅샷을 커밋하므로
  **빌드는 여전히 결정적이고 CI에서 재현 가능**하며, diff 리뷰도 그대로 된다.
- 부정적 / 트레이드오프:
  - MCP는 **해석된 값**만 준다 → alias 구조(`{colors.gray.300}`)와 `$type` 메타데이터가 손실된다.
    스냅샷을 만들 때 `$type`을 **값 형태 + 변수 경로**로 추론해야 하고(규칙은 `gen-tokens`
    스킬의 `figma-snapshot.md`), 시맨틱 토큰이 참조 대신 리터럴 값이 될 수 있다.
  - 모드가 여러 개면 **모드별 노드/프레임을 각각 조회**해야 하고, 조회 대상 프레임에 쓰이지 않는
    변수는 결과에 나오지 않는다 → 토큰 쇼케이스 프레임을 디자이너와 합의해야 한다.
  - Figma 커넥터 인증(파일 접근 권한)이 필요하다. 인증이 없으면 폴백 경로를 쓴다.
- 후속 작업: MCP가 변수 컬렉션·모드·타입을 직접 노출하게 되면 `$type` 추론 단계를 제거한다.
  조회 대상 프레임/노드가 확정되면 `.figma-source.json`을 기준으로 재조회를 정례화한다.

## 검토한 대안

- **Token Studio export 유지(ADR 0010)** — 파이프라인은 검증됐지만 수동 핸드오프 병목과 플러그인
  강제가 그대로 남는다. 형식만 물려받고 입력 경로를 교체하는 쪽을 택했다.
- **빌드 단계에서 MCP를 직접 호출** — 커밋할 입력이 없어져 비결정적이고, CI에 Figma 인증이 없어
  재현 불가. 0010의 배제 사유가 여기에는 그대로 유효하므로 배제.
- **Figma REST API(`/v1/files/:key/variables/local`) 스크립트** — 컬렉션·모드·`resolvedType`을
  구조적으로 주므로 추론이 필요 없다는 장점이 있으나, **Enterprise 플랜 전용**이고 액세스 토큰
  관리가 붙는다. 플랜 제약으로 지금은 배제 — Enterprise로 올라가면 재검토할 가치가 있다.
- **토큰 수기 입력** — 0010과 동일한 이유로 배제(드리프트·휴먼 에러·SSOT 부재).
