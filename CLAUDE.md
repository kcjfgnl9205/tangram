# Tangram (PUZMU) — 프로젝트 가이드

칠교놀이 웹 서비스. pnpm + Turborepo 모노레포.

| 패키지 | 설명 | 로컬 |
| --- | --- | --- |
| `apps/service` | `@tangram/service` — 사용자용 칠교놀이 | http://localhost:5173 |
| `apps/admin` | `@tangram/admin` — 관리자 | http://localhost:5174 |
| `packages/shared` | `@tangram/shared` — Supabase DB 타입 등 공용 코드 | — |
| `supabase/` | 마이그레이션 · Edge Functions (두 앱 공용) | — |

```bash
pnpm dev            # 두 앱 동시
pnpm dev:service    # 서비스만
pnpm type-check     # 전체 타입 체크
pnpm gen:types      # Supabase DB 타입 재생성
```

---

## 공통 프론트엔드 규칙

아래 규칙은 사내 허브(`frontend-ai-common-prompt`)에서 복사해 온 것이다.
**직접 수정하지 않는다** — 고칠 내용은 허브에서 고치고 재복사한다(`claude/install.md` 4번).

@.claude/rules/00-core.md
@.claude/rules/05-working-with-claude.md
@.claude/rules/06-response-style.md
@.claude/rules/10-guardrails.md
@.claude/rules/15-working-sessions.md
@.claude/rules/20-project-structure.md
@.claude/rules/35-accessibility.md
@.claude/rules/36-motion-and-interaction.md
@.claude/rules/37-figma-to-code.md
@.claude/rules/40-api-types.md
@.claude/rules/50-testing-quality.md
@.claude/rules/70-git-and-reviews.md
@.claude/rules/80-security-and-secrets.md
@.claude/rules/90-ci.md
@.claude/rules/vue/code-style.md
@.claude/rules/vue/error-handling.md
@.claude/rules/vue/i18n.md
@.claude/rules/vue/state-and-data.md

---

## 이 프로젝트의 예외 (허브 규칙과 다른 점)

허브 규칙은 어드민 중심으로 쓰여 있어 이 서비스와 맞지 않는 부분이 있다.
**아래 항목은 의도된 차이이므로 규칙에 맞춘다고 되돌리지 않는다.**

### 1. 테마는 다크모드가 아니다

`rules/vue/code-style` 은 `dark:` 배리언트를 금지한다. 이 프로젝트에 `dark:` 사용은 **없고**,
`entities/theme` 의 테마(모던 파스텔 / 비비드 바우하우스 / 노르딕 뮤트)는 **칠교 조각 팔레트를
바꾸는 제품 기능**이다. `base.css` 의 `[data-theme="..."]` CSS 변수로 구현한다. 규칙과 충돌하지 않는다.

### 2. 서버 상태 관리 라이브러리를 쓰지 않는다

`rules/vue/state-and-data` 는 서버 상태를 Vue Query 로 다루라고 한다. 이 프로젝트는
Supabase 클라이언트를 직접 호출하고(`entities/*/api`), 목록은 `useInfiniteScroll` 컴포저블로
처리한다. 도입은 별도 논의 대상이며 현재 코드의 결함이 아니다.

### 3. OpenAPI 타입 생성을 쓰지 않는다

`rules/40-api-types` 의 `openapi-typescript` 대신 **Supabase CLI 가 DB 스키마에서 타입을 생성**한다.

```bash
pnpm gen:types   # → packages/shared/src/types/supabase.ts
```

이 파일은 **생성 파일이다.** 손으로 고치지 말고 마이그레이션 적용 후 재생성한다.

### 4. 테스트 하네스가 아직 없다

`rules/50-testing-quality` 가 요구하는 Vitest · Playwright · Storybook 이 설치돼 있지 않다.
`pnpm lint` · `pnpm test` 스크립트도 없다. 현재 품질 게이트는 `pnpm type-check` 와 `pnpm build` 뿐이다.

> **`.claude/settings.json` 의 Stop 훅 주의** — 훅은 `lint → type-check → test` 를 돌리고
> 실패하면 세션 종료를 막는다. `apps/admin` 의 타입 에러가 남아 있는 동안에는 훅이 계속 걸린다.
> 급할 때 탈출구는 `CLAUDE_SKIP_VERIFY=1`.

---

## 도메인 메모

### 도안 제목은 두 갈래다

`tangrams` 테이블의 제목 해석은 **반드시** `useTangramTitle()`(`entities/tangram/lib/title.ts`)
한 곳을 거친다. 직접 `metaStore.getText()` 를 부르지 않는다.

| | 공식 도안 | 사용자 도안 |
| --- | --- | --- |
| 식별 | `key` (번역 키) | `title` (작성자 입력 원문) |
| 번역 | `translation_meta` 에서 ko/en/ja | **번역하지 않음** — 원문 그대로 |
| 플래그 | `is_official = true` | `is_official = false` |

```ts
getTitle(item) = getText(item.key, locale) || item.title?.trim() || t('tangram.untitled')
```

사용자 도안을 공식으로 승격할 때는 `translation_meta` 에 행을 추가하고 `tangrams.key` 를 채운다.
그러면 폴백 1단계에서 걸려 자동으로 다국어 제목이 된다.

**`translation_meta` 에 사용자 생성 제목을 넣지 않는다.** 이 테이블은 전체를 메모리에 올려
쓰므로(`metaStore.ensureLoaded()`) 행 수가 콘텐츠에 비례해 늘면 안 된다.

### 다국어 메타는 앱당 한 번만 로드한다

`useMetaStore().ensureLoaded()` 가 중복 호출과 동시 요청을 막는다. 라우터 가드에서 호출하되
매 네비게이션마다 재조회하지 않는다.
