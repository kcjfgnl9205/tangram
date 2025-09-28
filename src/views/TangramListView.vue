<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getResourceUrl } from '@/apis/customAxios'
import { Card } from '@/components/tangram'
import type { Tangram } from '@/types'

const items = ref<Tangram[]>([])
onMounted(async () => {
  try {
    const res = await fetch(getResourceUrl('data/index.json'))
    items.value = await res.json()
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <div class="w-full h-full min-h-screen bg-indigo-100">
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
