<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { ButtonIcon, SelectBox, Toggle } from '@/shared/ui'
import { THEMES, useThemeStore, type ThemeId } from '@/entities/theme'
import { usePreferencesStore } from '@/entities/preferences'
import type { Locale } from '@/shared/types'

const emit = defineEmits<{ close: [] }>()

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const themeStore = useThemeStore()
const preferencesStore = usePreferencesStore()
const { showAccuracy } = storeToRefs(preferencesStore)

const languageOptions = [
  { value: 'ko', label: '🇰🇷 한국어' },
  { value: 'en', label: '🇺🇸 English' },
  { value: 'ja', label: '🇯🇵 日本語' },
]

const themeOptions = computed(() => THEMES.map((t) => ({ value: t.id, label: t.label })))

const handleLocaleChange = (value: string | number) => {
  const next = value as Locale
  locale.value = next
  localStorage.setItem('lang', next)
  const newPath = `/${next}${route.fullPath.replace(/^\/(ko|en|ja)/, '')}`
  router.replace(newPath)
}

const handleThemeChange = (value: string | number) => {
  themeStore.setTheme(value as ThemeId)
}
</script>

<template>
  <div
    class="bg-white rounded-2xl shadow-2xl w-[min(90vw,400px)] max-h-[85vh] overflow-hidden flex flex-col"
    role="dialog"
    aria-label="설정"
  >
    <!-- 헤더 -->
    <div class="flex items-center justify-between px-5 h-14 border-b border-neutral-200">
      <h2 class="text-base font-semibold">설정</h2>
      <ButtonIcon icon="close-icon" size="md" aria-label="닫기" @click="emit('close')" />
    </div>

    <!-- 본문 -->
    <div class="flex-1 overflow-y-auto px-5 py-5 space-y-4">
      <SelectBox
        label="언어"
        :model-value="locale"
        :options="languageOptions"
        @update:model-value="handleLocaleChange"
      />

      <SelectBox
        label="테마"
        :model-value="themeStore.themeId"
        :options="themeOptions"
        @update:model-value="handleThemeChange"
      />

      <!-- 정답률 표시 토글 -->
      <div class="flex items-center justify-between pt-1">
        <span class="text-sm text-neutral-800">{{ t('tangram.detail.showAccuracy') }}</span>
        <Toggle v-model="showAccuracy" />
      </div>
    </div>
  </div>
</template>
