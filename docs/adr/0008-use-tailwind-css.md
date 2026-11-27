# 0008. 스타일링에 Tailwind CSS 사용

- 상태: accepted
- 날짜: 2026-06-12
- 결정자: 프론트엔드 팀

## 배경 (Context)

create-vue 스캐폴드는 scoped `<style>` 블록과 전역 `base.css`/`main.css` 색상 시스템을
사용했다. 이는 스타일링 결정을 여러 파일에 흩뜨려 일관된 디자인 언어를 강제하기 어렵게 한다.

## 결정 (Decision)

스타일은 **Tailwind CSS v4** 유틸리티 클래스만으로 작성한다. 구성:

- `vite.config.ts`에 `@tailwindcss/vite` 플러그인 (프로젝트 Vite 설정을 병합하는 Storybook에도
  동일하게 적용됨).
- 단일 전역 진입점 `src/app/styles/main.css`에 `@import 'tailwindcss';`와 `html`/`body`/`#app`
  기본값을 위한 작은 `@layer base`.
- 컴포넌트는 유틸리티 클래스를 직접 사용; 컴포넌트별 `<style>` 블록 없음.
- 동적 variant(예: 버튼 종류)는 `<script setup>`의 클래스 문자열로 매핑
  (`src/shared/ui/BaseButton/BaseButton.vue` 참고).
- 클래스 순서는 `prettier-plugin-tailwindcss`로 강제.
- 다크모드는 `prefers-color-scheme`(Tailwind v4 기본)을 따르며 `dark:`로 표현.

## 결과 (Consequences)

- 긍정적: 일관된 간격/색상, 죽은 CSS 없음, 스타일 colocation, 손으로 쓰는 CSS 표면 축소.
- 부정적: 템플릿의 클래스 목록이 길어짐; 팀이 유틸리티 이름을 익혀야 함.
- 후속 작업: 패턴이 드러나면 반복되는 클래스 묶음을 (`@apply` 중심 CSS가 아니라) 컴포넌트로
  추출한다.

## 검토한 대안

- **scoped SFC 스타일 (기존)** — 일관성 없음, 공유 디자인 토큰 없음.
- **UnoCSS** — 유사한 모델, 생태계가 작음; Tailwind가 팀 기본값.
- **컴포넌트 라이브러리 (Vuetify/PrimeVue)** — 어드민 스타터가 지금 필요로 하는 것보다 무겁고
  지나치게 정형화됨.
