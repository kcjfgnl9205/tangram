<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { RouteNames } from '@/router'
import { useAuthStore } from '@/stores'
import { LanguageSwitcher, Button } from '@/components/ui'

const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const handleLogoClick = () => {
  router.push({ name: RouteNames.TANGRAM_LIST })
}

const handleLogin = () => {
  router.push({ name: RouteNames.LOGIN })
}

const handleLogout = async () => {
  try {
    await authStore.logout()
  } catch (e) {
    alert('로그아웃에 실패했습니다.')
    console.error(e)
  }
}
</script>

<template>
  <header
    class="w-full sticky top-0 z-[100] bg-white/70 backdrop-blur-md border-b border-neutral-200"
  >
    <div
      class="max-w-[1280px] px-4 flex justify-between items-center m-auto h-14 text-base leading-5"
    >
      <div class="text-lg font-bold cursor-pointer" @click="handleLogoClick">Tangram</div>
      <div class="flex gap-2 items-center">
        <LanguageSwitcher />
        <Button v-if="!!user" variant="btn-red" @click="handleLogout">로그아웃</Button>
        <!-- <Button v-else variant="btn-blue" @click="handleLogin">로그인</Button> -->
      </div>
    </div>
  </header>
</template>
