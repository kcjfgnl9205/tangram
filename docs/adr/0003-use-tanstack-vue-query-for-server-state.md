# 0003. 서버 상태에 TanStack Vue Query 사용

- 상태: accepted
- 날짜: 2026-06-12
- 결정자: 프론트엔드 팀

## 배경 (Context)

어드민 앱은 읽기 위주이며 캐싱, 백그라운드 리페치, 로딩/에러 상태, 요청 중복 제거가
필요하다. 이를 Pinia나 raw fetch 위에 직접 구현하면 실수가 잦고 반복적이다.

## 결정 (Decision)

모든 서버 상태에 `@tanstack/vue-query`를 사용한다. 쿼리/뮤테이션 훅은 해당
`entities`/`features` 슬라이스의 `api` 세그먼트에 둔다 (`src/entities/user/api/useUsersQuery.ts`
참고). `QueryClient`는 `app` 계층(`src/app/providers`)에서 제공한다.

## 결과 (Consequences)

- 긍정적: 캐싱, 재시도, 비동기 상태를 일관되게 처리한다.
- 부정적: 익혀야 할 상태 도구가 둘이다 (서버는 Vue Query, 클라이언트는 Pinia).
- 후속 작업: 쿼리 키는 해당 훅 옆에 함께 둔다.

## 검토한 대안

- **모든 것을 Pinia로** — 캐시/리페치 기능이 없어 보일러플레이트가 많다.
- **컴포넌트에서 raw fetch** — 중복 제거/캐시가 없고 비동기 처리가 흩어진다.
