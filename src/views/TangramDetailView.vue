<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useCanvasStore, useTangramStore } from '@/stores'
import { Canvas } from '@/components/canvas'
import { createObject } from '@/utils'
import type { Tangram } from '@/types'

const { t } = useI18n()
const route = useRoute()
const canvasStore = useCanvasStore()
const tangramStore = useTangramStore()
const { objects } = storeToRefs(canvasStore)

const { items } = storeToRefs(tangramStore)
const item = ref<Tangram | null>(null)

onMounted(async () => {
  try {
    item.value = items.value.find((item) => item?.key === route.params.id) ?? null
    if (item.value) {
      const key = item.value.key
      const res = await fetch(`https://cdn.playtangram.com/data/${key}.json`)
      const data = await res.json()
      const arr = []
      for (const obj of data) {
        const item = createObject(obj.type, { ...obj })
        arr.push(item)
      }
      objects.value = arr
    }
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <div class="w-full h-[calc(100dvh-3.5rem)]">
    <!-- Canvas 영역 (제목 제외하고 꽉 채움) -->
    <main class="flex-1 flex justify-center p-4 w-full h-full items-center gap-2">
      <Canvas />
    </main>
  </div>
</template>
