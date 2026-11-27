<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { RouteNames } from '@/app/router/router-name'
import { Button, ButtonIcon, BrandMark, SelectBox } from '@/shared/ui'
import { useAuthStore } from '@/entities/user'
import type { Locale } from '@/shared/types'
import MobileSidebar from './MobileSidebar.vue'

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
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
  router.replace(`/${next}${route.fullPath.replace(/^\/(ko|en|ja)/, '')}`)
}
</script>

<template>
  <!-- 키보드 사용자가 헤더 메뉴를 매번 지나치지 않도록 -->
  <a
    href="#main"
    class="sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:top-0 focus:left-0 focus:px-4 focus:py-2.5 focus:bg-ink focus:text-white focus:text-body-sm focus:font-semibold focus:rounded-br-lg"
  >
    {{ t('header.skipToContent') }}
  </a>

  <header
    class="w-full sticky top-0 z-[100] bg-white/88 backdrop-blur-md backdrop-saturate-150 border-b border-line"
  >
    <div class="px-5 flex justify-between items-center gap-6 h-16 max-w-[1120px] mx-auto">
      <router-link :to="{ name: RouteNames.HOME }" class="shrink-0">
        <BrandMark />
        <span class="sr-only">PUZMU 홈</span>
      </router-link>

      <!-- 데스크톱 메뉴 (md 이상) — 지금 보고 있는 화면은 진하게 -->
      <nav class="hidden md:flex items-center gap-7 ml-auto mr-2 text-body-md">
        <router-link
          :to="{ name: RouteNames.TANGRAM_LIST }"
          class="text-ink-3 hover:text-ink-2 transition-colors [&.router-link-active]:text-ink [&.router-link-active]:font-bold"
        >
          {{ t('header.nav.puzzles') }}
        </router-link>
        <router-link
          :to="{ name: RouteNames.SHOP }"
          class="text-ink-3 hover:text-ink-2 transition-colors [&.router-link-active]:text-ink [&.router-link-active]:font-bold"
        >
          {{ t('header.nav.shop') }}
        </router-link>
      </nav>

      <div class="hidden md:flex gap-2 items-center">
        <Button v-if="isLoggedIn" variant="btn-default" @click="handleLogout">
          {{ t('header.logout') }}
        </Button>
        <div class="w-[132px]">
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
        :aria-label="t('header.openMenu')"
        @click="sidebarOpen = true"
      />
    </div>
  </header>

  <MobileSidebar v-model:open="sidebarOpen" />
</template>
