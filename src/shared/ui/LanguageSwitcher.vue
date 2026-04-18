<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { LocaleSelect } from '@/shared/types'

const { locale } = useI18n()
const router = useRouter()
const route = useRoute()

// 지원하는 언어 목록
const availableLocales: LocaleSelect[] = [
  { value: 'ko', label: '🇰🇷 한국어' },
  { value: 'en', label: '🇺🇸 English' },
  { value: 'ja', label: '🇯🇵 日本語' },
]

const currentLocale = ref(locale.value)

// 언어 변경 핸들러
const changeLocale = () => {
  locale.value = currentLocale.value
  localStorage.setItem('lang', currentLocale.value)

  const newPath = `/${currentLocale.value}${route.fullPath.replace(/^\/(ko|en|ja)/, '')}`
  router.push(newPath)
}
</script>

<template>
  <div class="p-1 border-[1px] border-neutral-300 bg-white text-sm rounded-lg">
    <select v-model="currentLocale" @change="changeLocale">
      <option v-for="lang in availableLocales" :key="lang.value" :value="lang.value">
        {{ lang.label }}
      </option>
    </select>
  </div>
</template>
