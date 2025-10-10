<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { RouteNames } from '@/router/router-name'
import { useMetaStore } from '@/stores'
import { getResourceUrl } from '@/utils'
import type { Locale, Tangram } from '@/types'

interface Props {
  item: Tangram
}
const { item } = defineProps<Props>()

const metaStore = useMetaStore()
const { locale } = useI18n()
const t = (key: string) => metaStore.getText(key, locale.value as Locale)

const router = useRouter()
const handleClick = () => {
  router.push({ name: RouteNames.TANGRAM_DETAIL, params: { id: item.id } })
}
</script>

<template>
  <div
    class="bg-white rounded-lg w-full h-48 flex flex-col cursor-pointer border-2 border-neutral-200 hover:shadow-lg transition-all group"
    @click="handleClick"
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
  </div>
</template>
