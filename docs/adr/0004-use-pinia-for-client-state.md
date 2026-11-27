# 0004. 클라이언트 상태에 Pinia 사용

- 상태: accepted
- 날짜: 2026-06-12
- 결정자: 프론트엔드 팀

## 배경 (Context)

일부 상태는 순수 클라이언트 측(UI 토글, 마법사 단계, 세션 범위 설정)이며 Vue Query가
관리하는 서버 캐시([0003](0003-use-tanstack-vue-query-for-server-state.md))에 속하지 않는다.

## 결정 (Decision)

클라이언트/UI 상태에는 (이미 create-vue 기본값인) Pinia를 사용한다. 스토어는 슬라이스의
`model` 세그먼트에 setup-store 스타일로 둔다 (`src/features/counter/model/useCounterStore.ts`
참고). Pinia는 `app` 계층 프로바이더에서 설치한다.

## 결과 (Consequences)

- 긍정적: 공식 Vue 솔루션, 훌륭한 DevTools와 TS 추론.
- 부정적: 서버 데이터는 Pinia가 아니라 Vue Query에 두도록 규율이 필요하다.

## 검토한 대안

- **Vuex** — 레거시; TypeScript 친화성이 약하다.
- **provide/inject만 사용** — DevTools가 없고, 공유 상태에 대한 확장성이 떨어진다.
