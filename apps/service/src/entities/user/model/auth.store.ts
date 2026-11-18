import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/shared/lib/supabase/supabaseClient'
import { signOut, getProfile } from '@/entities/user/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const profile = ref<any>(null)
  const session = ref<any>(null)

  const isLoggedIn = computed(() => !!user.value)

  const initialize = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      session.value = data.session
      user.value = data.session?.user ?? null
      if (user.value) {
        profile.value = await getProfile(user.value.id)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const logout = async () => {
    try {
      await signOut()
    } catch (e) {
      console.error(e)
    } finally {
      user.value = null
      profile.value = null
      session.value = null
    }
  }

  return { user, profile, session, isLoggedIn, initialize, logout }
})
