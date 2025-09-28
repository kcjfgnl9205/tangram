<script setup lang="ts">
import { useRouter } from 'vue-router'
import { RouteNames } from '@/router'
import type { Tangram } from '@/types'
import { getResourceUrl } from '@/apis/customAxios'

interface Props {
  item: Tangram
}
const { item } = defineProps<Props>()

const router = useRouter()
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
      <img
        :src="getResourceUrl(`thumbnail/${item.key}.png`)"
        alt="thumbnail"
        class="w-full h-full object-contain"
      />
    </div>

    <div class="basis-1/4 px-2 flex flex-col justify-center text-center">
      <p class="">
        <span v-for="n in item.level" :key="n" class="text-red-500 text-lg">🔥</span>
      </p>
      <h2 class="font-bold text-base text-black truncate">
        {{ item.key }}
      </h2>
    </div>
  </div>
</template>
