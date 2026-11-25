# 0005. openapi-typescript로 API 타입 생성

- 상태: accepted
- 날짜: 2026-06-12
- 결정자: 프론트엔드 팀

## 배경 (Context)

백엔드는 OpenAPI 명세를 제공한다. 요청/응답 타입을 프론트엔드에서 수작업으로 미러링하면
불일치(drift)와 런타임 사고가 발생한다.

## 결정 (Decision)

`openapi-typescript`로 OpenAPI 명세에서 타입을 생성하고
(`npm run gen:api` → `src/shared/api/schema.d.ts`), 타입세이프 `openapi-fetch` 클라이언트
(`src/shared/api/client.ts`)를 통해 사용한다. 생성된 파일은 커밋하되 읽기 전용으로 취급한다
(ESLint/Prettier에서 무시).

명세 소스는 `OPENAPI_SCHEMA` 환경 변수(URL 또는 경로)로 설정하며, 기본값은
`./openapi.json`이다.

## 결과 (Consequences)

- 긍정적: 경로/파라미터/응답이 엔드투엔드로 타입 체크되고 동기화를 유지한다.
- 부정적: 명세가 바뀌면 `gen:api`를 다시 실행해야 한다 (CI/개발 흐름에 연동할 것).
- 참고: `openapi-typescript@7`은 `typescript@^5` peer를 선언한다. 이를 만족시키기 위해
  `typescript`를 5.9.x로 핀한다 (`package.json`). 덕분에 peer 충돌이 없어 별도의
  `legacy-peer-deps` 설정(`.npmrc`)이 필요 없다. (이전에는 TS 6 + `legacy-peer-deps`로
  우회했으나, 깔끔한 의존성 트리를 위해 TS 5로 정렬했다.)

## 검토한 대안

- **수작업 타입** — 불일치, 중복.
- **orval / openapi-generator** — 더 무겁다; 풀 클라이언트 생성까지는 필요 없다.
