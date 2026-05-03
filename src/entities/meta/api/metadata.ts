import { supabase } from '@/shared/lib/supabase/supabaseClient'

// 칠교놀이 다국어 조회
export const fetchTranslationMeta = async () => {
  const { data, error } = await supabase
    .from('translation_meta')
    .select('*')
    .order('id', { ascending: false })

  if (error) throw new Error(`Tangram 다국어 조회 실패: ${error.message}`)
  return data
}
