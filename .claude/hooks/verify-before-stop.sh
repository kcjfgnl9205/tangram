#!/usr/bin/env sh
# Stop 훅 — "다 됐다"고 말하기 전에 품질 게이트를 실제로 돌린다.
#
# rules/50-testing-quality.md 의 검증 runbook을 사람(또는 AI)의 선의에 맡기지 않고
# 기계로 강제한다. 소스가 바뀐 채로 세션을 끝내려 하면 lint → type-check → test 를
# 돌리고, 실패하면 exit 2 로 종료를 막고 실패 출력을 Claude 에게 돌려준다.
#
# 설치: .claude/settings.json 의 hooks.Stop 에서 이 파일을 호출한다(timeout 600).
#
# 동작 요약
#   - 소스 변경 없음            → 통과 (아무것도 안 돌림)
#   - 같은 변경을 이미 검증함    → 통과 (캐시 히트, 중복 실행 안 함)
#   - 게이트 실패               → exit 2, 실패 로그를 Claude 에게 전달
#   - CLAUDE_SKIP_VERIFY=1      → 통과 (급할 때의 탈출구. 남용하면 훅이 무의미해진다)
set -u

INPUT=$(cat 2>/dev/null || true)

# 1) 무한 루프 방지 — 이 훅 때문에 다시 깨어난 턴이면 더 막지 않는다.
case "$(printf '%s' "$INPUT" | tr -d ' \n')" in
  *'"stop_hook_active":true'*) exit 0 ;;
esac

# 2) 명시적 탈출구
[ "${CLAUDE_SKIP_VERIFY:-0}" = "1" ] && exit 0

ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0
cd "$ROOT" || exit 0
[ -f package.json ] || exit 0

# 3) 변경된 소스 파일 추리기 (문서·설정만 바뀐 세션은 게이트를 돌리지 않는다)
CHANGED=$(git status --porcelain --untracked-files=all 2>/dev/null \
  | sed 's/^...//' \
  | sed 's/.* -> //' \
  | grep -E '\.(ts|tsx|vue|js|mjs|cjs|css)$' \
  | grep -vE '(^|/)(dist|coverage|node_modules|storybook-static|playwright-report|test-results)/' \
  || true)

[ -z "$CHANGED" ] && exit 0

# 4) 같은 상태를 이미 검증했으면 다시 돌리지 않는다
FINGERPRINT=$(printf '%s\n' "$CHANGED" | while IFS= read -r f; do
  [ -f "$f" ] && shasum "$f" 2>/dev/null || echo "missing $f"
done | shasum | awk '{print $1}')

CACHE="$ROOT/.claude/.verify-cache"
if [ -f "$CACHE" ] && [ "$(cat "$CACHE" 2>/dev/null)" = "$FINGERPRINT" ]; then
  exit 0
fi

# 5) 패키지 매니저 판별
if [ -f pnpm-lock.yaml ]; then PM=pnpm
elif [ -f yarn.lock ]; then PM=yarn
else PM=npm
fi

LOG=$(mktemp -t claude-verify)
FAILED=""

run_step() {
  step=$1
  # package.json 에 없는 스크립트는 건너뛴다 (모노레포 루트/단일 앱 모두 지원)
  grep -q "\"$step\"[[:space:]]*:" package.json || return 0
  printf '\n$ %s run %s\n' "$PM" "$step" >>"$LOG"
  if ! "$PM" run "$step" >>"$LOG" 2>&1; then
    FAILED="$step"
    return 1
  fi
  return 0
}

for STEP in lint type-check test; do
  run_step "$STEP" || break
done

if [ -n "$FAILED" ]; then
  {
    echo "검증 실패: \`$PM run $FAILED\` 가 통과하지 않았습니다."
    echo "완료 보고 전에 원인을 고치고 다시 돌려야 합니다 (rules/50-testing-quality.md)."
    echo "--- 마지막 60줄 ---"
    tail -n 60 "$LOG"
  } >&2
  rm -f "$LOG"
  exit 2
fi

mkdir -p "$ROOT/.claude"
printf '%s' "$FINGERPRINT" >"$CACHE"
rm -f "$LOG"
echo "verify-before-stop: lint/type-check/test 통과"
exit 0
