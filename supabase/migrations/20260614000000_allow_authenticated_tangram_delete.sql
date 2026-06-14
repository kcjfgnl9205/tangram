-- 로그인(authenticated) 사용자가 tangram 을 소프트 삭제(deleted_at 채우기)할 수 있도록 UPDATE 정책 추가
-- 익명(anon) 사용자는 삭제할 수 없음 (정책 미부여)
DROP POLICY IF EXISTS "tangrams_update_authenticated" ON public.tangrams;
CREATE POLICY "tangrams_update_authenticated"
  ON public.tangrams
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
