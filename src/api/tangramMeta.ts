import { supabase } from '@/lib/supabase/supabaseClient'
import type { TangramTranslation } from '@/types'

// 칠교놀이 다국어 조회
export const fetchTangramTranslationMeta = async () => {
  const { data, error } = await supabase
    .from('tangrams_translation_meta')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Tangram 다국어 조회 실패: ${error.message}`)
  return data as TangramTranslation[]
}
