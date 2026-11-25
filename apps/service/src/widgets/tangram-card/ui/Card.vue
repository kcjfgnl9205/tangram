<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTangramTitle } from '@/entities/tangram'
import { getResourceUrl } from '@/shared/lib'
import { Badge, Icon, Loading } from '@/shared/ui'
import type { Tangram } from '@/shared/types'

interface Props {
  item: Tangram
  selectable?: boolean
  selected?: boolean
  /** 이 카드의 PDF 를 만드는 중 */
  printing?: boolean
}
const { item, selectable = false, selected = false, printing = false } = defineProps<Props>()
const emit = defineEmits<{ click: []; print: [] }>()

const { t } = useI18n()
const { getTitle } = useTangramTitle()

const displayTitle = computed(() => getTitle(item))

// 등록 후 7일 이내면 NEW
const isNew = computed(() => {
  if (!item.created_at) return false
  const diffDays = (Date.now() - new Date(item.created_at).getTime()) / (1000 * 60 * 60 * 24)
  return diffDays <= 7
})

/**
 * 난이도는 1~5 를 세 단계로 묶어 보여준다.
 * 색만으로 구분하지 않도록 아이콘 모양(원·마름모·별)도 함께 달라진다 —
 * 글을 못 읽는 아이와 색각 이상 사용자 모두를 위해서다.
 */
const level = computed(() => {
  const d = Math.min(Math.max(item.difficulty ?? 3, 1), 5)
  if (d <= 2) return { key: 'easy', label: t('tangram.level.easy') }
  if (d === 3) return { key: 'normal', label: t('tangram.level.normal') }
  return { key: 'hard', label: t('tangram.level.hard') }
})

const viewCount = computed(() => (item.view_count ?? 0).toLocaleString())
const downloadCount = computed(() => (item.download_count ?? 0).toLocaleString())
</script>

<template>
  <article
    class="relative rounded-card border bg-surface overflow-hidden transition-colors"
    :class="
      selectable && selected
        ? 'border-primary ring-2 ring-primary/30'
        : 'border-line hover:border-line-strong'
    "
  >
    <!-- 선택 체크박스 — 링크 안에 넣으면 클릭이 서로 잡아먹는다 -->
    <span
      v-if="selectable"
      class="absolute z-[2] top-2 left-2 flex h-6 w-6 items-center justify-center rounded-md border-2 bg-white/90"
      :class="selected ? 'border-primary bg-primary text-white' : 'border-neutral-400'"
      aria-hidden="true"
    >
      <Icon v-if="selected" icon="check-icon" class="h-4 w-4" />
    </span>

    <Badge v-if="isNew && !selectable" text="NEW" class="absolute top-2 left-2 z-[2]" />

    <!-- 인쇄는 목록에서 바로 되어야 한다. 줄을 늘리지 않도록 썸네일 위에 얹는다.
         hover 로만 띄우면 모바일에서 영영 안 보이므로 항상 보이게 둔다. -->
    <button
      v-if="!selectable"
      type="button"
      :disabled="printing"
      :aria-busy="printing || undefined"
      class="absolute z-[2] top-2 right-2 grid place-items-center w-8 h-8 rounded-lg border border-line bg-white/92 text-ink-2 transition-colors hover:bg-white hover:border-line-strong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer disabled:cursor-wait disabled:text-ink-3"
      :aria-label="t('tangram.card.print', { name: displayTitle })"
      @click.stop="emit('print')"
    >
      <Loading v-if="printing" size="sm" />
      <Icon v-else icon="print-icon" class="w-4 h-4" />
    </button>

    <!-- 카드 전체가 하나의 링크다. 안에 버튼을 두지 않는다 -->
    <a
      href="#"
      class="block cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
      @click.prevent="emit('click')"
    >
      <span class="grid place-items-center aspect-[4/3] p-4 bg-surface-sub">
        <img
          :src="getResourceUrl(item.thumbnail_url)"
          :alt="displayTitle"
          width="320"
          height="240"
          loading="lazy"
          decoding="async"
          class="w-full h-full object-contain"
        />
      </span>

      <span class="block px-3.5 pt-2.5 pb-3.5">
        <span class="block text-body-md font-semibold truncate text-ink">{{ displayTitle }}</span>

        <!-- 난이도와 숫자를 한 줄에 모아 제목보다 뒤로 물린다 -->
        <span
          class="flex items-center gap-1.5 mt-0.5 text-body-xs text-ink-3 tabular-nums whitespace-nowrap overflow-hidden"
        >
          <span class="inline-flex items-center gap-1 shrink-0">
            <Icon :icon="`level-${level.key}-icon`" class="w-3.5 h-3.5" />
            {{ level.label }}
          </span>
          <span class="w-0.5 h-0.5 rounded-full bg-line-strong shrink-0" aria-hidden="true" />
          <span class="inline-flex items-center gap-1">
            <Icon icon="view" class="w-3.5 h-3.5" />
            <span class="sr-only">{{ t('tangram.card.views') }} </span>{{ viewCount }}
          </span>
          <span class="inline-flex items-center gap-1">
            <Icon icon="download" class="w-3.5 h-3.5" />
            <span class="sr-only">{{ t('tangram.card.downloads') }} </span>{{ downloadCount }}
          </span>
        </span>
      </span>
    </a>
  </article>
</template>
