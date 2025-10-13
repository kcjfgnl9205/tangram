<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { RouteNames } from '@/router/router-name'
import { useAuthStore } from '@/stores'
import { LanguageSwitcher, Button } from '@/components/ui'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

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
    <div class="px-6 flex justify-between items-center m-auto h-14 text-base leading-5 container">
      <div class="flex gap-12">
        <div
          class="text-lg font-bold cursor-pointer"
          @click="() => router.push({ name: RouteNames.HOME })"
        >
          PUZMU
        </div>
        <div class="flex gap-4">
          <div
            class="text-lg font-bold cursor-pointer"
            @click="() => router.push({ name: RouteNames.TANGRAM_LIST })"
          >
            {{ t('header.tangram') }}
          </div>
          <!-- <div
          class="text-lg font-bold cursor-pointer"
          @click="() => router.push({ name: RouteNames.TANGRAM_LIST })"
        >
          폴리노미오
        </div> -->
        </div>
      </div>

      <div class="flex gap-2 items-center">
        <LanguageSwitcher />
        <Button v-if="!!user" variant="btn-red" @click="handleLogout">로그아웃</Button>
        <!-- <Button v-else variant="btn-blue" @click="handleLogin">로그인</Button> -->
      </div>
    </div>
  </header>
</template>
