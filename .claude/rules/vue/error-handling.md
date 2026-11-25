# 60. 에러 처리 & 사용자 피드백

> **쉽게 말하면:** 에러를 사용자에게 알리는 방식(토스트 등)을 한곳에서 일관되게.

프론트엔드 에러 처리의 SSoT와 토스트 규약을 정의한다. (백엔드 에러 응답 규약과 짝을 이룬다.)

## 에러 소스

- **API 에러** — Vue Query 훅에서 `throw error`. 화면은 `isError`/`error`로 분기.
- **에러 envelope** — 백엔드 규약에 맞춘 형태를 `shared/api`에서 단일 파싱. 컴포넌트가 raw 응답을
  직접 뜯지 않는다.

## 토스트 규약 (한 곳에서만 발생)

- 에러 토스트는 **한 레이어만** 소유한다 — 우리 선택은 **중앙 인터셉터**다
  (`shared/api/middleware`). 호출부는 비즈니스 분기만 하고 토스트를 띄우지 않는다.
  둘 다에서 토스트하면 중복 발생(테스트/UX 모두 깨짐).
- 띄우는 **방법**은 앱이 주입한다 — `app/providers` 에서 `setApiErrorHandler()` 에
  `useToast()` 를 연결한다. 그래서 `shared/api` 는 디자인시스템을 import 하지 않는다.
- 에러를 화면 안에 인라인으로 보여 주려면 그 요청만 `skipErrorToast` 헤더로 뺀다.
- **성공 토스트는 호출부가 띄운다** — 무엇이 성공인지는 화면만 안다
  (`toast.success('저장했습니다')`).
- 성공/에러 메시지는 레지스트리(SSoT)에서 해석. 메시지 문자열을 컴포넌트에 흩뿌리지 않는다.
- 메시지는 `string | string[]` 가능성을 항상 가정(검증 에러 배열).

## 확인 모달 (파괴적 동작)

- 되돌릴 수 없는 동작 전에는 **`await confirm()`** 으로 묻는다. 콜백을 넘기지 않아
  호출부가 평평하게 읽힌다.

  ```ts
  const modal = useModal()
  if (!(await modal.confirm({ title: '삭제할까요?', confirmText: '삭제', variant: 'danger' })))
    return
  await remove(id)
  ```

- 임의의 모달은 `modal.open(SomeModal, { props })` 로 연다. 부모에 `ref` 와
  `<SomeModal v-model:open>` 을 선언하지 않으므로, 목록 행 액션이나 컴포저블처럼
  마크업이 없는 자리에서도 열 수 있다.
- 여는 컴포넌트는 `open` prop 을 받고 `update:open` 을 쏘기만 하면 된다 — 공용
  `Modal`·`ConfirmModal` 이 이미 그 모양이다. 배경 클릭·Esc·포커스 가둠·스크롤 잠금은
  그 안의 reka-ui 가 처리하므로 **직접 키 리스너를 달지 않는다**.
- `ModalHost` 는 앱 루트(`app/App.vue`)에 **하나만** 둔다.

## 폼/입력 검증

- 서버 검증 응답을 신뢰하되, 즉시 UX는 클라이언트 검증으로 보완.
- 파괴적(비가역) 액션 전에는 확인 UI를 둔다.

## 템플릿

표준 에러/토스트 처리 패턴은 [`docs/ai/error-toast-template.md`](../../../docs/ai/error-toast-template.md) 참조.

## 토스트 UI

- 공용 `Toaster` 를 앱 루트(`app/App.vue`)에 **하나만** 둔다. 띄우기는 어디서든
  `useToast()` — 큐가 모듈 싱글턴이라 컴포넌트 밖(인터셉터 등)에서도 부를 수 있다.
- 변형은 `success`·`error`·`warning`·`info`, 위치는 우하단, 자동 닫힘(에러·경고는 더 길게)
  - 수동 닫기. 문구는 호출부가 넘긴다(패키지는 vue-i18n 에 묶이지 않는다).

> 백엔드 에러 코드 카탈로그·envelope 형태가 확정되면 `shared/api/errors` 의 파싱 규칙을
> 그에 맞춰 좁힌다.
