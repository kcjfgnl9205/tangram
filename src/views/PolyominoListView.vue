<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { RouteNames } from '@/router/router-name'
import { Card } from '@/components/tangram'
import type { Polyomino } from '@/types'
import { fetchPolyominoList } from '@/api/polyomino'

const router = useRouter()
const items = ref<Polyomino[]>([])
onMounted(async () => {
  try {
    const data = await fetchPolyominoList()
    items.value = data
  } catch (e) {
    console.error('목록 조회 실패: ', e)
  }
})

const handleClick = (id: number) => {
  router.push({ name: RouteNames.POLYOMINO_DETAIL, params: { id } })
}
</script>

<template>
  <div class="w-full h-full min-h-screen">
    <div class="relative flex flex-col items-center w-full">
      <main
        class="w-full h-full container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-12 gap-2 p-2 md:p-4"
      >
        <template v-for="(item, index) of items" :key="index">
          <Card :item="item" @click="() => handleClick(item.id)" />
        </template>
      </main>

      <footer class="mt-24"></footer>
    </div>
  </div>
</template>
