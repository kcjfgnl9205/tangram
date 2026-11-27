# 40. API 레이어 — 타입세이프 클라이언트 (openapi)

> **쉽게 말하면:** 서버와 주고받는 데이터는 타입을 자동 생성해서 안전하게 다룬다. (Vue·React 공통)

## 타입 생성 (openapi-typescript) — 공통

- 요청/응답 타입을 **직접 작성하지 않는다.** OpenAPI 명세에서 생성한다.
  ```
  OPENAPI_SCHEMA=<url|path> pnpm run gen:api
  ```
- 출력 `src/shared/api/schema.d.ts`는 **생성 파일** — 손으로 수정 금지, lint/format 제외.
- 타입세이프 클라이언트 `src/shared/api/client.ts`(`openapi-fetch`)가 새 `paths`를 자동 인식.
- 기본적으로 런타임 스키마 검증 라이브러리(zod 등)를 도입하지 않는다 — 타입은 생성 타입으로 보장.

## 인터셉터 — `openapi-fetch` 미들웨어

- 공통 요청/응답 처리는 **`shared/api/middleware.ts` 한 곳**에 둔다. 토큰 주입(`Authorization`)과
  401 처리가 여기 있고, 클라이언트(`client.ts`)가 `apiClient.use(authMiddleware)`로 한 번 등록한다.
- 미들웨어는 **토큰이 어디서 오는지 모른다.** 앱이 `app/providers`에서
  `setAuthTokenProvider()`·`setUnauthorizedHandler()`로 주입한다 — 그래야 `shared/api`가
  스토어·라우터를 import하지 않고 모든 앱에서 똑같이 동작한다.
- **미들웨어에서 토스트를 띄우지 않는다.** 에러 토스트는 한 레이어만 소유한다(`rules/60`).
- 에러 envelope 파싱은 `shared/api/errors.ts`의 **`toApiError()` 한 곳**에서 한다. 컴포넌트가
  raw 응답을 직접 뜯지 않는다(`rules/60`). 백엔드 에러 카탈로그가 확정되면 이 파서를 좁힌다.

## axios가 필요할 때

- **기본 클라이언트는 `openapi-fetch`다.** 새 엔드포인트는 `gen:api`로 타입을 만들고 이 클라이언트로 붙인다.
- OpenAPI 명세가 없는 레거시 엔드포인트, 업로드 진행률처럼 **fetch로 안 되는 이유가 분명할 때만**
  프로젝트에 `axios`를 추가한다. 기본 템플릿에는 설치되어 있지 않다.
- 추가하더라도 `openapi-fetch`를 **대체하지 않는다.** 두 클라이언트가 공존하면 인터셉터와 에러 파싱이
  두 벌이 되어 `rules/60`의 "한 레이어" 원칙이 깨진다. axios 인스턴스도 `shared/api`에 두고,
  토큰·401 처리는 위와 **같은 공급자**(`setAuthTokenProvider` 등)를 재사용하며 에러는 `toApiError()`로 모은다.

## 쿼리 훅으로 쓰기

- 생성 타입 + `openapi-fetch` 클라이언트를 **TanStack Query 훅**으로 감싼다. 슬라이스 결정:
  리소스 → `entities/<noun>/api`, 액션 → `features/<action>/api`. 쿼리 키는 훅과 colocation + export.
- 프레임워크별 훅 패턴(Vue Query / React Query)은 **`rules/vue/state-and-data`** 또는
  **`rules/react/state-and-data`** 참조. 공통 원칙: `{ data, error }` 구조분해 → 실패 시
  `throw toApiError(error)` (화면은 `ApiError.messages`만 읽는다). 명세가 에러 응답을 선언한
  엔드포인트라면 `response`도 함께 구조분해해 `toApiError(error, response.status)`로 넘긴다.
