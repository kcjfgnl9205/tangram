<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { ButtonIcon, SelectBox, Toggle } from '@/shared/ui'
import { THEMES, useThemeStore, type ThemeId } from '@/entities/theme'
import { usePreferencesStore } from '@/entities/preferences'
import { useCanvasStore } from '@/entities/canvas'
import { useMetaStore } from '@/entities/meta'
import { incrementTangramDownload } from '@/entities/tangram/api/tangram'
import { useCopyLink } from '@/shared/composables'
import { downloadCanvasPdf } from '@/shared/lib'
import type { Locale } from '@/shared/types'

const emit = defineEmits<{ close: [] }>()

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const themeStore = useThemeStore()
const preferencesStore = usePreferencesStore()
const canvasStore = useCanvasStore()
const metaStore = useMetaStore()
const { showAccuracy } = storeToRefs(preferencesStore)
const { currentPuzzle } = storeToRefs(canvasStore)
const { handleCopy } = useCopyLink()

// 퍼즐 제목 (다운로드 파일명)
const title = computed(() =>
  currentPuzzle.value ? metaStore.getText(currentPuzzle.value.key, locale.value as Locale) : '',
)

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

// 복사 버튼
const handleCopyLink = () => {
  const url = new URL(window.location.href)
  url.searchParams.set('utm_source', 'share')
  url.searchParams.set('utm_medium', 'copy')
  url.searchParams.set('utm_campaign', 'tangram-share')
  if (currentPuzzle.value?.key) {
    url.searchParams.set('utm_content', currentPuzzle.value.key)
  }
  handleCopy(url.toString())
  emit('close')
}

// PDF다운로드
const handleDownloadPdf = async () => {
  try {
    const filename = title.value ? `칠교놀이(${title.value}).pdf` : '칠교놀이.pdf'
    await downloadCanvasPdf(filename)

    // 다운로드 성공 시에만 카운트 증가
    if (currentPuzzle.value?.id) {
      await incrementTangramDownload(currentPuzzle.value.id)
    }
    emit('close')
  } catch (error) {
    console.error('PDF 다운로드 실패:', error)
  }
}
</script>

<template>
  <div
    class="bg-white shadow-2xl flex flex-col overflow-hidden w-full h-full md:w-[min(90vw,400px)] md:h-auto md:max-h-[85vh] md:rounded-2xl"
    role="dialog"
    aria-label="설정"
  >
    <!-- 헤더 -->
    <div class="flex items-center justify-between px-5 h-14 border-b border-neutral-200">
      <h2 class="text-heading-sm">설정</h2>
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
        <span class="text-body-sm text-neutral-800">{{ t('tangram.detail.showAccuracy') }}</span>
        <Toggle v-model="showAccuracy" />
      </div>

      <!-- 액션 버튼: 링크 복사 / PDF 다운로드 (퍼즐 진입 시에만) -->
      <div v-if="currentPuzzle" class="border-t border-neutral-200 pt-4 space-y-2">
        <button
          type="button"
          class="w-full flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer hover:bg-neutral-100 transition-colors text-body-sm text-neutral-800"
          @click="handleCopyLink"
        >
          <span>{{ t('tangram.detail.toolbar.linkCopy') }}</span>
        </button>
        <button
          type="button"
          class="w-full flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer hover:bg-neutral-100 transition-colors text-body-sm text-neutral-800"
          @click="handleDownloadPdf"
        >
          <span>{{ t('tangram.detail.toolbar.downloadPdf') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
