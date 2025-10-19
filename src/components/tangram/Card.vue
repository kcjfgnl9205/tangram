<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMetaStore } from '@/stores'
import { getResourceUrl } from '@/utils'
import { Badge } from '@/components/ui'
import type { Locale, Polyomino, Tangram } from '@/types'
import { POLYOMINO_TYPE_LABEL, PolyominoType } from '@/types'

interface Props {
  item: Tangram | Polyomino
}
const { item } = defineProps<Props>()
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

  return diffDays <= 3 // 등록 후 3일 이내면 true
})
</script>

<template>
  <div
    class="bg-white rounded-lg w-full h-48 flex flex-col cursor-pointer border-2 border-neutral-200 hover:shadow-lg transition-all group relative"
    @click="emit('click')"
  >
    <div class="basis-3/4 w-full overflow-hidden flex items-center justify-center">
      <img
        :src="getResourceUrl(item.thumbnail_url)"
        alt="칠교놀이 도안"
        class="w-full h-full object-contain group-hover:scale-105 transition-all"
      />
    </div>

    <div class="basis-1/4 pb-2 flex flex-col justify-center items-center gap-1">
      <h2 class="font-semibold text-base text-neutral-900 truncate">
        {{ t(item.key) }}
      </h2>
    </div>

    <div class="absolute top-2 left-2 flex gap-2">
      <Badge
        v-if="'type' in item"
        :type="
          item.type === PolyominoType.TETROMINO
            ? 'yellow'
            : item.type === PolyominoType.PENTOMINO
              ? 'green'
              : item.type === PolyominoType.HEXOMINO
                ? 'red'
                : 'yellow'
        "
        :text="POLYOMINO_TYPE_LABEL[item.type]"
      />
      <Badge v-if="isNew" type="yellow" text="New" />
    </div>
  </div>
</template>
