<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMetaStore } from '@/entities/meta'
import { getResourceUrl } from '@/shared/lib'
import { Badge, Icon } from '@/shared/ui'
import type { Locale, Tangram } from '@/shared/types'

interface Props {
  item: Tangram
  selectable?: boolean
  selected?: boolean
}
const { item, selectable = false, selected = false } = defineProps<Props>()
const emit = defineEmits(['click'])

const metaStore = useMetaStore()
const { locale } = useI18n()
const t = (key: string) => metaStore.getText(key, locale.value as Locale)

// "New" 뱃지 표시 여부 계산
const isNew = computed(() => {
  if (!item.created_at) return false

  const created = new Date(item.created_at)
  const now = new Date()

  // 시간 차이 (밀리초 → 일 단위로 변환)
  const diffMs = now.getTime() - created.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  return diffDays <= 7 // 등록 후 7일 이내면 true
})

const difficultyLevel = computed(() => Math.min(Math.max(item.difficulty ?? 3, 1), 5))

const difficultyLabel = computed(() => {
  if (difficultyLevel.value <= 2) return { text: 'Easy', color: 'text-emerald-600' }
  if (difficultyLevel.value === 3) return { text: 'Normal', color: 'text-sky-600' }
  return { text: 'Hard', color: 'text-rose-600' }
})

const viewCount = computed(() => (item.view_count ?? 0).toLocaleString())
const downloadCount = computed(() => (item.download_count ?? 0).toLocaleString())
</script>

<template>
  <div
    class="border rounded-xl cursor-pointer group/card hover:bg-stone-100 transition-colors"
    :class="
      selectable && selected
        ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50/40'
        : 'border-neutral-300'
    "
    @click="emit('click')"
  >
    <div class="rounded-t-xl relative overflow-hidden">
      <!-- 선택 모드 체크박스 -->
      <span
        v-if="selectable"
        class="absolute top-2 right-2 z-20 flex h-6 w-6 items-center justify-center rounded-md border-2 bg-white/90 shadow-sm"
        :class="selected ? 'border-blue-500 bg-blue-500 text-white' : 'border-neutral-400'"
        aria-hidden="true"
      >
        <svg v-if="selected" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
          <path
            fill-rule="evenodd"
            d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.3 3.3 6.8-6.8a1 1 0 0 1 1.4 0z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
      <Badge v-if="isNew" text="NEW" class="absolute top-2 left-2 z-10" />
      <Icon v-if="item.show_answer_preview" icon="hint" />

      <div class="p-3 bg-white">
        <div class="aspect-video"></div>
      </div>

      <div
        class="absolute inset-3 rounded-lg overflow-hidden shadow-xs bg-sky-50/80 transition-all duration-300 group-hover/card:inset-0 group-hover/card:shadow-none group-hover/card:rounded-t-xl group-hover/card:rounded-b-none"
      >
        <img
          :src="getResourceUrl(item.thumbnail_url)"
          alt="칠교놀이 도안"
          width="320"
          height="180"
          loading="lazy"
          decoding="async"
          class="w-full h-full object-contain group-hover:scale-105 transition-all"
        />
      </div>
    </div>

    <div class="pt-2.5 px-2 pb-2 rounded-b-xl">
      <div class="flex flex-col gap-1 min-w-0">
        <div class="flex items-center justify-between gap-2">
          <p class="text-body-md font-semibold truncate text-neutral-800">
            {{ t(item.key) }}
          </p>
          <div
            class="flex items-center gap-0.5 text-body-sm shrink-0 leading-none"
            :aria-label="`난이도 ${difficultyLevel} / 5`"
            :title="`난이도 ${difficultyLevel} / 5`"
          >
            <span
              v-for="n in 5"
              :key="n"
              :class="n <= difficultyLevel ? 'text-amber-500' : 'text-neutral-300'"
            >
              ★
            </span>
          </div>
        </div>
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-3 text-body-sm text-neutral-500">
            <span class="flex items-center gap-1" :title="`조회수 ${viewCount}`">
              <Icon icon="view" class="w-4 h-4" />
              {{ viewCount }}
            </span>
            <span class="flex items-center gap-1" :title="`다운로드 ${downloadCount}`">
              <Icon icon="download" class="w-4 h-4" />
              {{ downloadCount }}
            </span>
          </div>

          <p :class="['text-body-sm font-medium tracking-wide text-neutral-500']">
            {{ difficultyLabel.text }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
