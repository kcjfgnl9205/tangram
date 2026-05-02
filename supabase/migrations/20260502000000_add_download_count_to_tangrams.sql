-- tangrams 에 다운로드 횟수 컬럼 추가
ALTER TABLE public.tangrams
  ADD COLUMN download_count bigint NOT NULL DEFAULT 0;

-- 다운로드 횟수 증가 RPC (딱 download_count 만 +1)
-- SECURITY DEFINER 로 테이블 UPDATE 권한 없이도 증가 가능하게 함
CREATE OR REPLACE FUNCTION public.increment_tangram_download(p_tangram_id bigint)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.tangrams
    SET download_count = download_count + 1
    WHERE id = p_tangram_id
      AND deleted_at IS NULL;
END;
$$;

-- 익명/로그인 사용자 모두 호출 가능하게
GRANT EXECUTE ON FUNCTION public.increment_tangram_download(bigint) TO anon, authenticated;
