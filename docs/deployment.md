# 배포 가이드 (Cloudflare Pages)

이 저장소는 pnpm + Turborepo 모노레포다. 앱마다 **Cloudflare Pages 프로젝트를 하나씩** 두고, 같은 GitHub 저장소(`kcjfgnl9205/tangram`)를 연결해 배포한다.

| 앱 | 패키지 | 도메인 | 상태 |
| --- | --- | --- | --- |
| 서비스 | `@tangram/service` (`apps/service`) | `www.puzmu.com` | 운영 중 |
| 어드민 | `@tangram/admin` (`apps/admin`) | `admin.puzmu.com` | 예정 |

## 1. 배포 방식

- 저장소 안에 배포 설정 파일(wrangler, GitHub Actions)은 **없다**. 빌드 설정은 모두 Cloudflare 대시보드에 있다.
- 연결된 브랜치(production: `main`)에 push 하면 Cloudflare 가 저장소를 클론하고, 대시보드에 적힌 빌드 명령을 실행한 뒤 출력 폴더를 배포한다.
- 결과는 GitHub 커밋 옆의 **Cloudflare Pages** 체크(✅ / ❌)로 보인다. 로그는 대시보드 → Workers & Pages → 프로젝트 → Deployments 에서 본다.
- `.env` 는 git 에 올리지 않는다(`.gitignore`). **빌드에 필요한 `VITE_*` 값은 대시보드의 환경 변수에 넣어야 한다.** Vite 는 빌드할 때 이 값을 번들에 박아 넣는다.

## 2. 서비스 (`www.puzmu.com`) 빌드 설정

대시보드 → Workers & Pages → (서비스 프로젝트) → Settings → Build

| 항목 | 값 |
| --- | --- |
| Root directory | `/` |
| Build command | `pnpm turbo run build --filter=@tangram/service` |
| Build output directory | `apps/service/dist` |
| Build watch paths (include) | `apps/service/*`, `packages/*`, `package.json`, `pnpm-lock.yaml` |

환경 변수 (Settings → Variables and Secrets)

| 이름 | 설명 |
| --- | --- |
| `NODE_VERSION` | `22` (Vite 7 은 Node 20.19+ / 22.12+ 필요) |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase |
| `VITE_R2_*` | R2 (`apps/service/.env.example` 참고) |

> **왜 `--filter` 인가?** 루트에서 `pnpm build` 를 하면 turbo 가 **모든 앱**을 빌드한다. 한 앱이 실패하면 전체가 실패하므로 Pages 프로젝트는 자기 앱만 빌드해야 한다.

### 2026-11-18 모노레포 전환 직후 배포 실패 기록

- 커밋 `f60de31`(모노레포 전환)에서 Cloudflare Pages 빌드가 실패했고, 사이트는 이전 배포(`81cded5`)가 그대로 서비스됐다.
- 대시보드 설정이 단일 앱 시절 값(`npm run build` / 출력 `dist`)으로 남아 있었던 것으로 추정된다.
  1. 루트 빌드가 admin 까지 빌드했고, admin 의 기존 타입 에러 때문에 실패한다.
  2. 빌드 결과는 루트 `dist` 가 아니라 `apps/service/dist` 에 생긴다.
- 해결: 위 표대로 설정을 바꾼 뒤 Deployments 에서 **Retry deployment**.

## 3. 어드민 (`admin.puzmu.com`) 배포 방법

같은 저장소에 Pages 프로젝트를 **하나 더** 만든다. 도메인(`puzmu.com`)이 이미 Cloudflare DNS 에 있으므로 서브도메인 연결은 대시보드에서 바로 된다.

### 3-1. 사전 작업 (코드)

- [x] admin 타입 에러 수정 (2026-11-18). admin 이 손으로 쓴 DB 타입 대신 `@tangram/shared` 의 생성 타입을 쓰도록 바꾸면서, 실제 스키마와 어긋난 곳도 함께 고쳤다.
  - 모든 테이블 `id` 는 `number` (기존 코드는 `string`)
  - `contacts.status` 는 숫자(1=신청, 2=답변완료). 기존 화면은 문자열(`대기`/`답변완료`/`보류`)을 쓰고 있어 라벨이 안 맞고 상태 변경이 실패했다.
  - `profiles` 에 없는 `last_sign_in_at` 컬럼(사용자 목록의 '마지막 로그인')은 제거했다. 필요하면 `auth.users` 에서 가져오는 RPC/Edge Function 이 필요하다.
- [x] 검색엔진 노출 막기: `apps/admin/public/robots.txt` (`Disallow: /`).

### 3-2. Pages 프로젝트 만들기

1. Workers & Pages → Create → Pages → Connect to Git → `kcjfgnl9205/tangram` 선택
2. 빌드 설정

   | 항목 | 값 |
   | --- | --- |
   | Production branch | `main` |
   | Root directory | `/` |
   | Build command | `pnpm turbo run build --filter=@tangram/admin` |
   | Build output directory | `apps/admin/dist` |
   | Build watch paths (include) | `apps/admin/*`, `packages/*`, `package.json`, `pnpm-lock.yaml` |

3. 환경 변수: `NODE_VERSION=22`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`
   - 예전 tangram-admin 저장소는 `.env` 를 커밋하고 있었다. 이 저장소에서는 커밋하지 않으므로 **반드시 대시보드에 넣어야 한다.**
4. Custom domains → `admin.puzmu.com` 추가 (DNS 레코드는 Cloudflare 가 자동으로 만든다).

### 3-3. 외부 서비스 설정

- [ ] **Supabase Auth**: Authentication → URL Configuration → Redirect URLs 에 `https://admin.puzmu.com/**` 추가 (로그인 후 리다이렉트용).
- [ ] **Edge Function CORS**: `supabase/functions/delete-from-r2` 를 브라우저에서 호출한다면 허용 Origin 에 `https://admin.puzmu.com` 이 들어가 있는지 확인.
- [ ] (선택) **Cloudflare Access** 로 `admin.puzmu.com` 앞에 이메일 인증을 한 겹 더 두면, 앱 로그인 전에 외부 접근을 막을 수 있다.

### 3-4. 기존 tangram-admin 배포 정리

예전 `tangram-admin` 저장소에 연결된 Pages 프로젝트가 있다면, 새 프로젝트가 잘 뜨는지 확인한 뒤 연결을 끊거나 삭제한다. 두 프로젝트가 같은 도메인을 쓰면 충돌한다.

## 4. 참고

- **Build watch paths**: 해당 경로에 변경이 없으면 그 프로젝트는 빌드를 건너뛴다. 서비스만 고쳤을 때 어드민이 다시 배포되지 않는다(반대도 마찬가지).
- **SPA 라우팅**: Pages 는 출력 폴더에 `404.html` 이 없으면 모든 경로를 `index.html` 로 보낸다. vue-router history 모드가 따로 설정 없이 동작한다.
- **로컬에서 배포 빌드 미리 확인**:
  ```bash
  pnpm turbo run build --filter=@tangram/service
  pnpm turbo run build --filter=@tangram/admin
  ```
