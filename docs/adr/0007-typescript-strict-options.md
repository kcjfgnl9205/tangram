# 0007. TypeScript strict 모드 및 추가 안전 옵션

- 상태: accepted
- 날짜: 2026-06-12
- 결정자: 프론트엔드 팀

## 배경 (Context)

`@vue/tsconfig`는 이미 `strict: true`를 켠다. 그 위에 어떤 추가 컴파일러 안전장치를
강제하고, 어떤 것을 의도적으로 끄는지 기록하고자 한다.

## 결정 (Decision)

`tsconfig.app.json`에서 `strict`에 더해 다음을 켠다:

- `noUncheckedIndexedAccess` — 배열/객체 조회 결과가 `T | undefined`.
- `noImplicitOverride` — `override` 키워드 필수.
- `noUnusedLocals` / `noUnusedParameters` — 죽은 바인딩 금지.
- `noFallthroughCasesInSwitch`, `forceConsistentCasingInFileNames`.

`exactOptionalPropertyTypes`는 의도적으로 **끈다**: Vue props 및 서드파티 타입과 함께
false positive가 잦아 이득 대비 비용이 크다.

## 결과 (Consequences)

- 긍정적: 인덱싱/대소문자/미사용 코드 부류의 버그를 컴파일 타임에 잡는다.
- 부정적: `noUncheckedIndexedAccess`로 조회 시 가끔 `?`/가드가 늘어난다.
- 후속 작업: 생태계가 개선되면 `exactOptionalPropertyTypes`를 재검토한다.

## 검토한 대안

- **`strict`만** — 인덱스 접근/미사용 코드 부류 버그를 놓친다.
- **`exactOptionalPropertyTypes` 포함 전체 플래그** — 오늘날 Vue와 함께 너무 시끄럽다.
