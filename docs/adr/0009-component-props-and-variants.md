# 0009. 컴포넌트 Props는 interface로, variant는 cva + cn으로

- 상태: accepted
- 날짜: 2026-06-12
- 결정자: 프론트엔드 팀

## 배경 (Context)

컴포넌트 props 타이핑과 조건부 Tailwind 클래스 구성 방식이 일관되지 않으면 컴포넌트마다
스타일이 제각각이 되고, 외부에서 주입한 클래스가 내부 클래스와 충돌(예: `px-4` vs `px-2`)해도
정리되지 않는다.

## 결정 (Decision)

**Props 타이핑** — 컴포넌트/페이지는 인라인 `defineProps<{ … }>()` 대신 `interface Props`를
정의한 뒤 사용한다:

```ts
interface Props {
  variant?: ButtonVariants['variant']
  class?: HTMLAttributes['class']
}
const props = withDefaults(defineProps<Props>(), { variant: 'primary', class: '' })
```

**variant 스타일** — variant가 있는 컴포넌트는 `class-variance-authority`(`cva`)로 클래스를
정의하고, variant 타입은 `VariantProps<typeof xVariants>`에서 파생한다. 외부 주입 클래스는
`class?: HTMLAttributes['class']` prop으로 받아 `cn`으로 병합한다. `cn`(`@/shared/lib`,
`src/shared/lib/utils.ts`)은 `clsx` + `tailwind-merge` 조합으로, 충돌하는 유틸리티는 나중 값이
이긴다.

Vue에서 `class`를 prop으로 선언하면 fallthrough에서 빠지므로 루트 요소에 이중 적용되지 않고,
`cn` 병합 결과만 적용된다. 레퍼런스 구현은 `src/shared/ui/BaseButton/BaseButton.vue`.

## 결과 (Consequences)

- 긍정적: 일관된 props 형태, 재사용 가능한 variant 정의, 예측 가능한 클래스 병합/충돌 해결.
- 부정적: 의존성 3개 추가(`class-variance-authority`, `clsx`, `tailwind-merge`) 및 약간의
  보일러플레이트.

## 검토한 대안

- **인라인 `defineProps` + 클래스 문자열 맵(Record)** — 이전 방식; 외부 클래스 병합/충돌
  해결이 없고 variant 타입 파생이 수동.
- **`tailwind-variants`(tv)** — cva 상위호환이지만, React 생태계에서 가장 널리 쓰이는
  `cva`를 팀 기본값으로 채택.
