<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { RouteNames } from '@/router'
import { Badge } from '@/components/ui'
import type { Locale, Tangram, BadgeType } from '@/types'

interface Props {
  item: Tangram
}
const { item } = defineProps<Props>()

const { t, locale } = useI18n()
const router = useRouter()
const title = computed(() => item.title?.[locale.value as Locale] ?? t('tangram.title'))

const badgeProps = computed<{ text: string; type: BadgeType }>(() => {
  if (item.level === 1) {
    return { text: t('tangram.badge.easy'), type: 'green' }
  } else if (item.level >= 2 && item.level <= 4) {
    return { text: t('tangram.badge.normal'), type: 'yellow' }
  } else if (item.level === 5) {
    return { text: t('tangram.badge.hard'), type: 'red' }
  }
  return { text: '', type: 'green' } // fallback
})

const handleClick = () => {
  router.push({ name: RouteNames.TANGRAM_DETAIL, params: { id: item.key } })
}
</script>

<template>
  <div
    class="bg-white rounded-lg w-full h-48 flex flex-col cursor-pointer border-2 border-neutral-200 hover:shadow-lg transition-all group"
    @click="handleClick"
  >
    <div class="basis-3/4 w-full overflow-hidden flex items-center justify-center">
      <img
        :src="item.thumbnail"
        alt="thumbnail"
        class="w-full h-full object-contain group-hover:scale-105 transition-all"
      />
    </div>

    <div class="basis-1/4 pb-2 flex flex-col justify-center items-center gap-1">
      <h2 class="font-semibold text-base text-neutral-900 truncate">
        {{ title }}
      </h2>
      <Badge :type="badgeProps.type" :text="badgeProps.text" />
    </div>
  </div>
</template>
