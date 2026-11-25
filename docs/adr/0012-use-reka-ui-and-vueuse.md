# 0012. 공유 UI는 Reka UI(헤드리스) + VueUse로 구성

- 상태: accepted
- 날짜: 2026-07-03
- 결정자: 프론트엔드 팀

## 배경 (Context)

`packages/shared`가 팀 공통 컴포넌트·컴포저블의 단일 원본이다(ADR 0002 FSD, 모노레포). 지금까지는
`Button`·`Input`처럼 로직이 거의 없는 프레젠테이션 컴포넌트를 `cva`+`cn`으로 직접 만들었다.

그런데 관리자/서비스 앱에 필요한 **오버레이·인터랙티브 컴포넌트**(Modal·Dropdown·Select·Tooltip·
Accordion·Checkbox·Radio·Switch 등)는 성격이 다르다. 이들은 **포커스 트랩·키보드 내비게이션·ARIA
역할/상태·click-outside·`Teleport`·플로팅 포지셔닝** 같은 접근성/상호작용을 정확히 구현해야 하는데,
직접 만들면 시간이 오래 걸리고 접근성 버그가 새기 쉽다. 마찬가지로 `useToggle`·`onClickOutside`·
`useLocalStorage` 같은 범용 컴포저블도 이미 검증된 구현이 생태계에 있다.

## 결정 (Decision)

**어려운 것은 검증된 라이브러리에, 쉬운 것은 직접** — 두 축으로 나눈다.

- **오버레이/인터랙티브 컴포넌트 → [Reka UI](https://reka-ui.com) (헤드리스)**. Reka UI는 **unstyled**
  프리미티브라 접근성·키보드·포커스·포지셔닝만 담당하고, 스타일은 우리가 기존처럼 **`cva`+`cn`+Tailwind**
  로 입힌다. 즉 `packages/shared`의 `BaseX`는 "Reka 프리미티브 + 우리 스타일" 래퍼가 된다.
  (대상: Modal(Dialog)·Dropdown(DropdownMenu)·Select·Tooltip·Accordion·Checkbox·RadioGroup·Switch 등)
- **단순 프레젠테이션 컴포넌트 → 직접 (`cva`+`cn`)**. `Button`·`Input`·`Textarea`·`Badge` 등 로직이
  없는 것은 의존성 없이 직접 만든다(제어권·번들 이득).
- **범용 컴포저블 → [VueUse](https://vueuse.org)**. `useToggle`·`onClickOutside`·`useLocalStorage`·
  `useMediaQuery` 등은 재발명하지 않는다. `packages/shared/composables`에는 **팀 도메인 특화 훅**
  (예: `useConfirm`, `usePagination`)만 둔다.
- **명명**: 공유 컴포넌트는 접두사 없이 `Button`·`Input`·`Modal`처럼 부른다(패키지 스코프가 이미
  네임스페이스 역할). `@WORKSPACE_NAME/shared`에서 export하고 앱은 `@/shared/ui` 배럴로 재-export한다.

## 결과 (Consequences)

- 긍정적: 접근성·키보드·포커스가 검증된 구현으로 보장되고, 우리 디자인 토큰/Tailwind와 충돌 없이
  스타일링 자유도를 유지한다. 컴포저블 재발명을 없애 유지비가 준다.
- 부정적 / 트레이드오프: 런타임 의존성 2개(`reka-ui`, `@vueuse/core`) 추가. 번들 영향은 tree-shaking과
  실제 사용 컴포넌트에 비례하며, 오버레이 접근성을 자체 구현하는 비용에 비하면 작다. Reka UI 마이너
  버전 업 시 API 변화를 따라가야 한다.
- 가드레일: `10-guardrails`의 "임의 패키지 추가 금지"에 따라 이 ADR로 근거를 남긴다. 이후 다른 UI
  라이브러리(예: 완제품 스타일 킷)를 섞지 않는다 — 헤드리스+자체 스타일 원칙을 유지한다.

## 검토한 대안

- **전부 직접 구현** — 의존성은 없지만 오버레이 접근성(포커스 트랩·키보드·ARIA·포지셔닝)을 직접
  만들어야 해 유지비·버그 위험이 크다. 핵심 가치(정확한 a11y)를 잃기 쉬워 배제.
- **완제품 스타일드 UI 킷(예: Vuetify/PrimeVue 등)** — 빠르지만 자체 디자인 토큰/Tailwind 워크플로와
  충돌하고 스타일 오버라이드 비용이 크다. 헤드리스가 우리 스타일 전략과 더 맞음.
- **Headless UI(@headlessui/vue)** — 유효한 대안이나 컴포넌트 커버리지가 Reka UI보다 좁다(Select·
  Combobox·Accordion 등). 커버리지·활발함 기준으로 Reka UI 채택.
