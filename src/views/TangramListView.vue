<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchTangramList } from '@/api/tangram'
import { Card } from '@/components/tangram'
import type { Tangram } from '@/types'

const items = ref<Tangram[]>([])
onMounted(async () => {
  try {
    const data = await fetchTangramList()
    items.value = data
  } catch (e) {
    console.error('목록 조회 실패: ', e)
  }
})
</script>

<template>
  <div class="w-full h-full min-h-screen">
    <div class="relative flex flex-col items-center w-full">
      <main
        class="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-12 max-w-[1280px] gap-2 p-2 md:p-4"
      >
        <template v-for="(item, index) of items" :key="index">
          <Card :item="item" />
        </template>
      </main>

      <footer class="mt-24"></footer>
    </div>
  </div>
</template>
