-- 익명 사용자도 tangram 을 생성할 수 있도록 user_id 를 nullable 로 변경
ALTER TABLE public.tangrams
  ALTER COLUMN user_id DROP NOT NULL;

-- anon / authenticated 모두 insert 가능 (user_id 는 본인 또는 NULL)
DROP POLICY IF EXISTS "tangrams_insert_anon_or_self" ON public.tangrams;
CREATE POLICY "tangrams_insert_anon_or_self"
  ON public.tangrams
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    user_id IS NULL
    OR user_id = auth.uid()
  );
