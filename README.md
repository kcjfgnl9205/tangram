# Tangram Puzzle Service (칠교놀이 서비스)

## 서비스 주소

**[서비스링크](https://www.puzmu.com)**

## 소개

이 프로젝트는 전통 퍼즐인 **칠교놀이(탱그램, Tangram)** 을 기반으로 한 웹 애플리케이션입니다.  
7개의 기본 조각을 활용하여 물고기, 집, 숫자, 하트 등 다양한 형태를 완성할 수 있습니다.  
퍼즐 맞추기를 통해 창의력과 공간 지각 능력을 기르고, 게임처럼 즐기면서 학습할 수 있는 서비스입니다.

## 주요 기능

- **퍼즐 모양 제공**
  - 숫자(1~9), 동물, 집, 하트, 꽃 등 다양한 퍼즐 템플릿 제공
  - 각 모양의 정답 예시 미리보기 기능
- **조작 기능**
  - 조각 회전 (좌우반전, 상하반전)
  - 자유롭게 드래그하여 조각 배치

## 저장소 구조 (pnpm + Turborepo 모노레포)

```
tangram/
├── apps/
│   ├── service/   # @tangram/service — 사용자용 칠교놀이 서비스 (http://localhost:5173)
│   └── admin/     # @tangram/admin   — 관리자 페이지 (http://localhost:5174)
├── packages/
│   └── shared/    # @tangram/shared  — 두 앱이 함께 쓰는 코드 (Supabase DB 타입 등)
├── supabase/      # Supabase 설정 · 마이그레이션 · Edge Functions (두 앱 공용 프로젝트)
├── pnpm-workspace.yaml
└── turbo.json
```

## 실행 방법

1. 저장소 클론

   ```bash
   git clone https://github.com/kcjfgnl9205/tangram.git .
   ```

2. 의존성 설치 (pnpm 은 `corepack enable pnpm` 으로 활성화)

   ```bash
   pnpm install
   ```

3. 환경 변수 — 각 앱의 `.env.example` 을 `.env` 로 복사해 값을 채운다.

   ```bash
   cp apps/service/.env.example apps/service/.env
   cp apps/admin/.env.example apps/admin/.env
   ```

4. 로컬 실행

   ```bash
   pnpm dev            # 두 앱 동시 실행
   pnpm dev:service    # 서비스만
   pnpm dev:admin      # 어드민만
   ```

## 자주 쓰는 명령

| 명령 | 설명 |
| --- | --- |
| `pnpm build` | 전체 앱 빌드 (turbo 캐시 사용) |
| `pnpm type-check` | 전체 타입 체크 |
| `pnpm format` | Prettier 포맷 |
| `pnpm gen:types` | Supabase DB 타입 재생성 → `packages/shared/src/types/supabase.ts` |
| `pnpm --filter @tangram/admin add <pkg>` | 특정 앱에만 의존성 추가 |
