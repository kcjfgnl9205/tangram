# 0002. 소스 레이아웃에 Feature-Sliced Design 사용

- 상태: accepted
- 날짜: 2026-06-12
- 결정자: 프론트엔드 팀

## 배경 (Context)

이 프로젝트는 많은 기능이 늘어날 것으로 예상되는 어드민 프론트엔드다. 평평한
`components/views/stores` 레이아웃은 확장되지 않는다: 의존성이 얽히고 소유권이 불분명해진다.

## 결정 (Decision)

`src/`를 [Feature-Sliced Design](https://feature-sliced.design)으로 구성하며, 계층은 상위에서
하위 순으로:

```
app → pages → widgets → features → entities → shared
```

한 계층은 자신보다 엄격히 하위인 계층(및 자기 자신)에서만 import할 수 있다. 이는
`eslint.config.ts`의 `eslint-plugin-boundaries`로 자동 강제된다. 각 슬라이스는 `index.ts`로
public API를 노출하며, 슬라이스 간 import는 반드시 이 barrel을 거쳐야 한다.

## 결과 (Consequences)

- 긍정적: 예측 가능한 의존 방향, 명확한 소유권, 린트로 강제됨.
- 부정적: 기능마다 디렉토리/보일러플레이트가 늘고, 학습 곡선이 있다.
- 후속 작업: `new-slice` 스킬이 규칙을 준수하는 슬라이스를 스캐폴딩한다.

## 검토한 대안

- **평평한 구조 (components/views/stores)** — create-vue 기본값; 확장되지 않는다.
- **Atomic Design** — UI 중심뿐; app/data 계층 문제를 다루지 못한다.
