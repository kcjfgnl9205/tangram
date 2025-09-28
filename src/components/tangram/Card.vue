<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { RouteNames } from '@/router'
import type { Locale, Tangram } from '@/types'

interface Props {
  item: Tangram
}
const { item } = defineProps<Props>()

const { t, locale } = useI18n()
const router = useRouter()
const title = computed(() => item.title?.[locale.value as Locale] ?? t('tangram.title'))
const handleClick = () => {
  router.push({ name: RouteNames.TANGRAM_DETAIL, params: { id: item.key } })
}
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-lg w-full h-48 flex flex-col cursor-pointer"
    @click="handleClick"
  >
    <div class="basis-3/4 w-full overflow-hidden flex items-center justify-center">
      <img :src="item.thumbnail" alt="thumbnail" class="w-full h-full object-contain" />
    </div>

    <div class="basis-1/4 px-2 flex flex-col justify-center text-center">
      <p class="">
        <span v-for="n in item.level" :key="n" class="text-red-500 text-lg">🔥</span>
      </p>
      <h2 class="font-bold text-base text-black truncate">
        {{ title }}
      </h2>
    </div>
  </div>
</template>
