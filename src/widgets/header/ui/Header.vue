<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { RouteNames } from '@/app/router/router-name'
import { useAuthStore } from '@/entities/user'
import { LanguageSwitcher, Button } from '@/shared/ui'
import { ThemeSwitcher } from '@/features/theme-switcher'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const showThemeSwitcher = computed(() => route.name === RouteNames.TANGRAM_DETAIL)

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
      class="px-6 flex justify-between items-center m-auto h-14 text-base leading-5 max-w-[1400px] mx-auto"
    >
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
        </div>
      </div>

      <div class="flex gap-2 items-center">
        <ThemeSwitcher v-if="showThemeSwitcher" />
        <LanguageSwitcher />
        <Button v-if="!!user" variant="btn-red" @click="handleLogout">로그아웃</Button>
      </div>
    </div>
  </header>
</template>
