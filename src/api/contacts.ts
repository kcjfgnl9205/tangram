import { supabase } from '@/lib/supabase/supabaseClient'
import type { Contact, CONTACT_STATUS, ContactUpdate } from '@/types'

// 1. Contact 목록 조회
export const fetchContactList = async () => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Contact 목록 조회 실패: ${error.message}`)
  return (data as Contact[]) ?? []
}

// 2. Contact 상세 조회
export const fetchContactDetail = async (id: number) => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) throw new Error(`Contact 상세 조회 실패: ${error.message}`)
  return data as Contact
}

// 3. Contact 등록 (누구나 가능)
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

// 4. Contact 수정 (관리자만)
export const updateContact = async (id: number, payload: Partial<ContactUpdate>) => {
  const { data, error } = await supabase
    .from('contacts')
    .update({
      email: payload.email,
      title: payload.title,
      contents: payload.contents,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()

  if (error || !data) throw new Error(`Contact 수정 실패: ${error?.message}`)
  return data[0] as Contact
}

// 6. Contact 상태 변경 (관리자만)
export const updateContactStatus = async (id: number, status: number) => {
  const { data, error } = await supabase
    .from('contacts')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()

  if (error || !data) throw new Error(`Contact 상태 변경 실패: ${error?.message}`)
  return data[0] as Contact
}

// 5. Contact 삭제 (관리자만)
export const deleteContact = async (id: number) => {
  const { error } = await supabase.from('contacts').delete().eq('id', id)

  if (error) throw new Error(`Contact 삭제 실패: ${error.message}`)
  return true
}
