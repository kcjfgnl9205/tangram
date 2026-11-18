import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/shared/lib/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAdmin = ref(false)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  /** 초기화: 세션 복원 및 auth 리스너 설정 */
  async function initAuth() {
    isLoading.value = true
    try {
      // 기존 세션 복원
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        user.value = session.user
        await checkIsAdmin(session.user.id)
      }

      // Auth 상태 변경 리스너
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          user.value = session.user
          await checkIsAdmin(session.user.id)
        } else {
          user.value = null
          isAdmin.value = false
        }
      })

      // 언마운트 시 구독 해제
      return () => subscription?.unsubscribe()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Auth init failed'
      console.error('initAuth error:', err)
    } finally {
      isLoading.value = false
    }
  }

  /** is_admin RPC 호출로 관리자 여부 확인 */
  async function checkIsAdmin(uid: string): Promise<void> {
    try {
      const { data, error: rpcError } = await supabase.rpc('is_admin', {
        uid,
      })

      if (rpcError) {
        console.error('is_admin RPC error:', rpcError)
        isAdmin.value = false
        return
      }

      isAdmin.value = !!data
    } catch (err) {
      console.error('checkIsAdmin error:', err)
      isAdmin.value = false
    }
  }

  /** 로그인 */
  async function login(email: string, password: string): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        error.value = signInError.message
        throw signInError
      }

      user.value = data.session?.user ?? null
      if (user.value) {
        await checkIsAdmin(user.value.id)
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed'
      console.error('login error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /** 로그아웃 */
  async function logout(): Promise<void> {
    isLoading.value = true
    try {
      await supabase.auth.signOut()
      user.value = null
      isAdmin.value = false
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Logout failed'
      console.error('logout error:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isAdmin,
    isLoading,
    error,
    isAuthenticated,
    initAuth,
    checkIsAdmin,
    login,
    logout,
  }
})
