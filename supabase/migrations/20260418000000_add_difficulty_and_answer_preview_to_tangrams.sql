-- 기존 데이터에는 difficulty=3, show_answer_preview=true 로 채워지고,
-- 이후 신규 행은 동일한 DEFAULT 가 적용됩니다.

ALTER TABLE public.tangrams
  ADD COLUMN difficulty smallint NOT NULL DEFAULT 3
    CHECK (difficulty BETWEEN 1 AND 5),
  ADD COLUMN show_answer_preview boolean NOT NULL DEFAULT true;
