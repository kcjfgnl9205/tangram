<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useCanvasStore, useTangramStore } from '@/stores'
import { Canvas } from '@/components/canvas'
import type { Locale, Tangram } from '@/types'

const route = useRoute()
const canvasStore = useCanvasStore()
const { objects } = storeToRefs(canvasStore)

const { t, locale } = useI18n()

const tangramStore = useTangramStore()
const { items } = storeToRefs(tangramStore)
const item = ref<Tangram | null>(null)

onMounted(async () => {
  try {
    item.value = items.value.find((item) => item?.key === route.params.id) ?? null
    if (item.value) {
      const key = item.value.key
      const res = await fetch(`https://cdn.playtangram.com/data/${key}.json`)
      objects.value = await res.json()
    }
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <div class="w-full h-[calc(100dvh-3.5rem)] bg-indigo-100 flex flex-col">
    <!-- 제목 영역 (고정 높이) -->
    <header class="py-10 text-center">
      <h1 class="text-2xl font-bold">
        {{ item?.title?.[locale as Locale] ?? t('tangram.title') }}
      </h1>
    </header>

    <!-- Canvas 영역 (제목 제외하고 꽉 채움) -->
    <main class="flex-1 flex justify-center">
      <div class="w-5/6 h-5/6">
        <Canvas />
      </div>
    </main>
  </div>
</template>
