-- 도안 주제 분류 — 목록의 주제 필터(동물·사물·사람·숫자)가 쓴다.
--
-- 안전도는 20261125000000 과 같다: 컬럼 추가뿐이라 배포본은 이 컬럼을 보지 않는다.
-- 주제 필터를 쓰려면 이 SQL 을 실행해야 한다. 실행 전까지 필터는 '전체'만 동작한다.
--
-- 기존 도안의 주제는 비어 있다(NULL). '전체'에서는 보이고 개별 주제에서는 빠진다.
-- 운영자가 admin 에서 채우거나, 아래 예시처럼 key 로 일괄 지정할 수 있다.

ALTER TABLE public.tangrams
  ADD COLUMN IF NOT EXISTS category text;

ALTER TABLE public.tangrams
  DROP CONSTRAINT IF EXISTS tangrams_category_check;
ALTER TABLE public.tangrams
  ADD CONSTRAINT tangrams_category_check
  CHECK (category IS NULL OR category IN ('animal', 'thing', 'people', 'number', 'shape'));

CREATE INDEX IF NOT EXISTS tangrams_category_idx
  ON public.tangrams (category)
  WHERE deleted_at IS NULL;

COMMENT ON COLUMN public.tangrams.category IS '도안 주제. animal/thing/people/number/shape. NULL 이면 미분류.';

-- 일괄 분류 예시 — 실제 key 를 확인하고 쓸 것
-- UPDATE public.tangrams SET category = 'number' WHERE key ~ '^number';
-- UPDATE public.tangrams SET category = 'animal' WHERE key IN ('cat','rabbit','fox','swan','fish');
