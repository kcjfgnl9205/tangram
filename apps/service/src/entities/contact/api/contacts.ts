import { supabase } from '@/shared/lib/supabase/supabaseClient'
import type { Contact, ContactUpdate } from '@/shared/types'

// Contact 등록 (누구나 가능)
export const createContact = async (payload: ContactUpdate) => {
  const { data, error } = await supabase
    .from('contacts')
    .insert({
      email: payload.email,
      title: payload.title,
      contents: payload.contents,
    })
    .select()

  if (error || !data) throw new Error(`Contact 등록 실패: ${error?.message}`)
  return data[0] as Contact
}
