-- 칠교놀이 소프트 삭제 권한 축소
--
-- 기존 정책(20260614000000)은 USING (true) / WITH CHECK (true) 였기 때문에
-- 로그인한 사용자라면 누구나 남이 만든 도안을 삭제할 수 있었다.
-- 본인이 만든 도안 또는 관리자만 삭제할 수 있도록 좁힌다.

DROP POLICY IF EXISTS "tangrams_update_authenticated" ON public.tangrams;

CREATE POLICY "tangrams_update_owner_or_admin"
  ON public.tangrams
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_admin(auth.uid())
  )
  WITH CHECK (
    user_id = auth.uid()
    OR public.is_admin(auth.uid())
  );

-- 익명(user_id IS NULL)으로 만들어진 기존 도안은 소유자가 없으므로 관리자만 정리할 수 있다.
