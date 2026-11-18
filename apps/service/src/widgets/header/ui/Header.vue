<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { RouteNames } from '@/app/router/router-name'
import { Button, ButtonIcon, SelectBox } from '@/shared/ui'
import { ThemeSwitcher } from '@/features/theme-switcher'
import { useAuthStore } from '@/entities/user'
import type { Locale } from '@/shared/types'
import MobileSidebar from './MobileSidebar.vue'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const showThemeSwitcher = computed(() => route.name === RouteNames.TANGRAM_DETAIL)
const sidebarOpen = ref(false)

const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)

const handleLogout = async () => {
  await authStore.logout()
}

const languageOptions = [
  { value: 'ko', label: '🇰🇷 한국어' },
  { value: 'en', label: '🇺🇸 English' },
  { value: 'ja', label: '🇯🇵 日本語' },
]

const handleLocaleChange = (value: string | number) => {
  const next = value as Locale
  locale.value = next
  localStorage.setItem('lang', next)
  const newPath = `/${next}${route.fullPath.replace(/^\/(ko|en|ja)/, '')}`
  router.replace(newPath)
}
</script>

<template>
  <header
    class="w-full sticky top-0 z-[100] bg-white/70 backdrop-blur-md border-b border-neutral-200"
  >
    <div
      class="px-6 flex justify-between items-center m-auto h-14 text-body-md max-w-[1400px] mx-auto"
    >
      <div class="flex gap-12 items-center">
        <div
          class="cursor-pointer text-heading-md"
          @click="() => router.push({ name: RouteNames.HOME })"
        >
          PUZMU
        </div>

        <!-- 데스크톱 메뉴 (md 이상) -->
        <div class="hidden md:flex gap-4">
          <div
            class="text-body-lg font-bold cursor-pointer"
            @click="() => router.push({ name: RouteNames.TANGRAM_LIST })"
          >
            {{ t('header.tangram') }}
          </div>
        </div>
      </div>

      <!-- 데스크톱 우측 (md 이상) -->
      <div class="hidden md:flex gap-2 items-center">
        <ThemeSwitcher v-if="showThemeSwitcher" />
        <Button v-if="isLoggedIn" variant="btn-default" @click="handleLogout">
          {{ t('header.logout') }}
        </Button>
        <div class="w-[150px]">
          <SelectBox
            :model-value="locale"
            :options="languageOptions"
            @update:model-value="handleLocaleChange"
          />
        </div>
      </div>

      <!-- 모바일 햄버거 (md 미만) -->
      <ButtonIcon
        icon="menu-icon"
        size="lg"
        class="md:hidden"
        aria-label="메뉴 열기"
        @click="sidebarOpen = true"
      />
    </div>
  </header>

  <MobileSidebar v-model:open="sidebarOpen" />
</template>
