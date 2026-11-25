-- 사용자 생성 도안의 의미 없는 key 정리
--
-- !! 적용 시점 주의 — 새 프론트엔드를 배포한 뒤에 돌린다.
--
-- 이전 배포본의 admin TangramEditModal 은 `key.value.trim()` 을 호출하므로
-- key 가 NULL 이면 수정 모달에서 TypeError 가 난다.
-- (service 쪽은 getText 가 '' 를 반환해 안전하다.)
--
-- 이 정리는 기능상 필수가 아니다. 폴백 체인이
--   getText(key) → '' → title → '이름 없는 도안'
-- 으로 이미 넘어가므로, 'playground-1762...' 가 key 에 남아 있어도 화면은 정상이다.
-- 데이터를 깔끔하게 두기 위한 선택적 정리다.
--
-- 되돌리려면 json_url 에 같은 값이 경로로 남아 있다:
--   UPDATE public.tangrams
--      SET key = regexp_replace(json_url, '^.*/(playground-[0-9]+)\.json$', '\1')
--    WHERE key IS NULL AND json_url LIKE '%playground-%';

UPDATE public.tangrams
   SET key = NULL
 WHERE key LIKE 'playground-%';
