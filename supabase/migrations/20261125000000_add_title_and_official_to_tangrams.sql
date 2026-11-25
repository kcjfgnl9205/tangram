-- 칠교놀이 제목 체계 분리
--
-- 공식 도안 : tangrams.key  → translation_meta 에서 ko/en/ja 조회 (기존 방식 유지)
-- 사용자 도안 : tangrams.title → 사용자가 입력한 원문을 그대로 사용 (번역 대상 아님)
--
-- 두 컬럼은 배타적으로 사용한다. 화면에서는 getText(key) → title → 폴백 순으로 해석.
-- translation_meta 에 UGC 를 넣지 않는 이유: 해당 테이블은 전체를 메모리에 올려 쓰므로
-- 사용자 생성 콘텐츠 수만큼 무한정 커지면 안 된다.

ALTER TABLE public.tangrams
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS title_lang text,
  ADD COLUMN IF NOT EXISTS is_official boolean NOT NULL DEFAULT false;

-- 공식 도안은 key 로 식별되므로 사용자 도안에서는 key 가 비어 있을 수 있다
ALTER TABLE public.tangrams
  ALTER COLUMN key DROP NOT NULL;

-- title 은 사용자 입력 — 길이 제한으로 목록 레이아웃 보호
ALTER TABLE public.tangrams
  DROP CONSTRAINT IF EXISTS tangrams_title_length_check;
ALTER TABLE public.tangrams
  ADD CONSTRAINT tangrams_title_length_check
  CHECK (title IS NULL OR char_length(title) BETWEEN 1 AND 40);

-- title_lang 은 지원 로케일만 허용
ALTER TABLE public.tangrams
  DROP CONSTRAINT IF EXISTS tangrams_title_lang_check;
ALTER TABLE public.tangrams
  ADD CONSTRAINT tangrams_title_lang_check
  CHECK (title_lang IS NULL OR title_lang IN ('ko', 'en', 'ja'));

-- 기존 데이터 백필:
--   playground-* 로 생성된 건 사용자 도안, 나머지(번역 key 보유)는 공식 도안으로 간주
UPDATE public.tangrams
   SET is_official = true
 WHERE key IS NOT NULL
   AND key <> ''
   AND key NOT LIKE 'playground-%';

-- NOTE: playground-* key 를 NULL 로 비우는 정리는 여기서 하지 않는다.
--   현재 배포본 admin 의 TangramEditModal 이 `key.value.trim()` 을 호출해
--   key 가 NULL 이면 TypeError 로 죽는다. 새 프론트가 배포된 뒤에
--   20261125000002_clear_playground_keys.sql 로 따로 적용한다.
--   폴백 체인(getText(key) || title || untitled)이 '' 를 거쳐 넘어가므로
--   이 정리는 미뤄도 새 프론트 동작에 영향이 없다.

-- 목록은 항상 is_official + deleted_at 으로 필터링되므로 복합 인덱스
CREATE INDEX IF NOT EXISTS tangrams_official_created_idx
  ON public.tangrams (is_official, created_at DESC)
  WHERE deleted_at IS NULL;

COMMENT ON COLUMN public.tangrams.title IS '사용자 생성 도안의 제목 원문. 공식 도안은 NULL 이며 key 로 번역을 조회한다.';
COMMENT ON COLUMN public.tangrams.title_lang IS 'title 이 작성된 언어 (ko/en/ja).';
COMMENT ON COLUMN public.tangrams.is_official IS '운영자가 승격한 공식 도안 여부. 목록 기본 탭의 노출 기준.';
