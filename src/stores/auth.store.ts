import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import { RouteNames } from '@/router'
import { supabase } from '@/lib/supabase/supabaseClient'
import { signOut, getProfile } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const route = useRoute()
  const router = useRouter()

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
        const data = await getProfile(user.value.id)
        console.log(data)
        profile.value = data
      }

      console.log(profile.value)
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

      // 현재 페이지의 meta 보고 리다이렉트 여부 결정
      if (route.meta.requiresAuth || route.meta.requiresAdmin) {
        router.push({ name: RouteNames.LOGIN })
      } else {
        // 권한 필요 없는 페이지는 그대로 머무름
        console.log('공개 페이지 → 그대로 유지')
      }
    }
  }

  return { user, profile, session, isLoggedIn, initialize, logout }
})
