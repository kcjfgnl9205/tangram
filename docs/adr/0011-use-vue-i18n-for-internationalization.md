# 0011. vue-i18n으로 국제화(i18n) 구성

- 상태: accepted
- 날짜: 2026-06-23
- 결정자: 프론트엔드 팀

> **업데이트 (2026-07-03)** — 결정(vue-i18n·Composition·타입안전 키·JSON SSOT)은 그대로이나 구조가
> 일부 바뀌어 아래 본문을 현행화했다: (1) 설정 위치를 `shared/config/i18n` → **`shared/i18n`**(독립
> shared 세그먼트)로 이동. (2) `LocaleSwitcher`를 앱 `shared/ui`에서 **공유 패키지 `packages/shared`**로
> 이관하고 앱 i18n 설정에 **비결합**(vue-i18n `availableLocales` + `labels` prop)으로 리팩터. (3) 로케일
> 영속화(`localStorage`·`<html lang>`)를 `setLocale()`에서 **watcher**로 옮겨, 로케일을 누가 바꾸든 동기화되게 함.

> **업데이트 (2026-07-03)** — 전용 `LocaleSwitcher` 컴포넌트는 **제거**했다. 언어 전환 UI는 공용
> `Select`(`@/shared/ui`)로 `SUPPORTED_LOCALES`/`LOCALE_LABELS`에서 옵션을 만들고 `setLocale(code)`로
> 전환한다(`App.vue` 참고). i18n 결정 자체는 불변 — 아래 본문의 `LocaleSwitcher` 언급은 이 방식으로 대체됐다.

## 배경 (Context)

어드민은 다국어(최소 한국어/영어)를 지원해야 한다. UI 문자열을 컴포넌트에 하드코딩하면
번역 누락·중복·드리프트가 생기고, 언어 전환·로케일 영속화·`<html lang>` 동기화 같은 공통
관심사를 매번 다시 구현하게 된다. 메시지 키를 타입 없이 문자열로 다루면 오타가 런타임까지
새어나간다.

이 프로젝트는 Composition API(`<script setup>`)만 쓰고, FSD 계층 규칙을 린트로 강제하며,
`schema.d.ts`(ADR 0005)·디자인 토큰(ADR 0010)처럼 **타입 안전 + 단일 진실 소스(SSOT)**
파이프라인을 선호한다. i18n도 같은 원칙을 따라야 한다.

## 결정 (Decision)

Vue 생태계 표준인 **`vue-i18n` v11**을 **Composition API 모드(`legacy: false`)**로 채택한다.

- **설정 위치**: `src/shared/i18n/`(독립 shared 세그먼트). `shared` 계층이라 어느 슬라이스에서나
  import할 수 있다. 인스턴스 생성은 여기서 하고, **앱 등록은 `app/providers`**에서 `app.use(i18n)`로 한다.
- **메시지 SSOT**: `locales/<code>/<domain>.json`. 언어별 폴더 안에 **도메인별 파일**을 두고,
  **파일명이 곧 최상위 네임스페이스**가 된다 (`nav.json` → `t('nav.home')`). 여러 도메인이
  공유하는 문자열은 언어별 `common.json` 하나에 둔다. 각 언어의 `index.ts` 배럴이 도메인
  파일들을 하나의 로케일 객체로 합친다. (대안으로 `import.meta.glob` 자동수집을 검토했으나,
  키 단위 정적 타입이 사라져 배제했다 — 아래 참고.)
- **타입 안전 키**: `ko/` 배럴(`locales/ko`)을 메시지 스키마로 삼아 `i18n.d.ts`에서
  `DefineLocaleMessage`를 모듈 보강(module augmentation)한다. `t('nav.home')`이 자동완성·타입
  체크되고, 다른 로케일은 `ko/`와 **구조가 같아야** 한다. 새 도메인 파일은 각 언어 폴더에
  추가하고 해당 `index.ts`에 한 줄 등록한다.
- **로케일 결정/영속화**: `detectLocale()`이 `localStorage` → `navigator.language` →
  `DEFAULT_LOCALE`(ko) 순으로 초기값을 정한다. 활성 로케일 변경은 **`watch(i18n.global.locale)`**가
  감지해 `localStorage` 저장 + `<html lang>` 갱신을 한곳에서 처리한다(누가 바꾸든 동기화). `setLocale()`은
  `locale.value`만 바꾸는 얇은 헬퍼다. 누락 키는 `FALLBACK_LOCALE`(en)로 채운다.
- **소비**: 컴포넌트는 `useI18n()`의 `t()`를 직접 쓴다(`vue-i18n` 표준). 언어 전환 UI는 공유 패키지
  `packages/shared`의 `LocaleSwitcher`로 제공한다 — 앱 i18n 설정에 **비결합**(vue-i18n `availableLocales` +
  `labels` prop)이라 앱 간 공유 가능. 앱에선 `@/shared/ui` 배럴이 이를 재-export한다.
- **Storybook**: `.storybook/preview.ts`의 `setup()`에서 i18n 플러그인을 전역 설치해 모든
  스토리가 `useI18n()`을 쓸 수 있게 한다. 유닛 테스트는 `mount(..., { global: { plugins: [i18n] } })`.

## 결과 (Consequences)

- 긍정적: 번역 키가 타입 안전해지고, 메시지가 JSON SSOT로 모인다. 언어 전환·영속화·`lang`
  동기화가 한곳(`shared/i18n`)에 캡슐화된다. FSD 경계와 Composition API 컨벤션을 지킨다.
- 부정적 / 트레이드오프: 런타임 의존성 1개(`vue-i18n`) 추가. `DefineLocaleMessage` 보강은
  빈 인터페이스 병합이 필요해 해당 줄에서 `@typescript-eslint/no-empty-object-type`를 비활성화한다.
  로케일 파일이 늘면 `ko.json`과 구조 동기화를 사람이 챙겨야 한다(키 누락은 폴백으로 가려질 수 있음).
- 후속 작업: 메시지가 커지면 슬라이스별 분할 로딩(지연 로딩)·날짜/숫자 포맷(`datetimeFormats`,
  `numberFormats`)·복수형(pluralization) 규칙을 도입한다. 번역 키 누락을 CI에서 검사하는
  스크립트를 추가하면 드리프트를 막을 수 있다.

## 검토한 대안

- **`import.meta.glob`로 로케일 파일 자동수집** — 도메인 파일을 자동 등록할 수 있어 배럴
  `index.ts`가 필요 없지만, 메시지 타입이 `Record<string, unknown>`으로 뭉개져 키 단위
  자동완성·타입 체크(이 ADR의 핵심)를 잃는다. 배럴 한 줄 등록 비용을 감수하고 타입 안전을 택함.
- **`vue-i18n` legacy 모드** — Options API 전제라 이 프로젝트의 `<script setup>` 컨벤션과 안 맞음.
- **`@intlify/unplugin-vue-i18n` 빌드타임 컴파일** — 메시지가 커지면 유용하나 현재 규모엔 과함.
  표준 런타임 구성으로 시작하고 필요 시 도입.
- **직접 구현한 경량 i18n(ref + 객체 맵)** — 의존성은 없지만 복수형·폴백·포맷·타입 안전 키를
  직접 만들어야 해 유지비가 큼.
- **번역 라이브러리 미사용(하드코딩)** — 다국어 요구사항과 정면으로 충돌.
