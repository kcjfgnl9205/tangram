<script setup lang="ts">
import { useRouter } from 'vue-router'
import { RouteNames } from '@/router'
import type { Tangram } from '@/types'

interface Props {
  item: Tangram
}

const { item } = defineProps<Props>()

const router = useRouter()

const handleClick = () => {
  router.push({ name: RouteNames.TANGRAM_DETAIL, params: { id: item.id } })
}
</script>

<template>
  <div class="rounded-lg shadow-md overflow-hidden bg-white cursor-pointer" @click="handleClick">
    <img :src="item.thumbnail" class="w-full object-cover" />
    <div class="p-4">
      <h2 class="text-xl font-bold text-gray-800 text-center">{{ item.title }}</h2>
    </div>
  </div>
</template>
