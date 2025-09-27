<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Canvas } from '@/components/canvas'
import { useCanvasStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const { t } = useI18n()

const canvasStore = useCanvasStore()
const { objects } = storeToRefs(canvasStore)

onMounted(() => {
  const data = localStorage.getItem('test')
  if (data) {
    objects.value = JSON.parse(data)
  }
})
</script>

<template>
  <div class="w-full h-dvh bg-indigo-100 flex flex-col">
    <!-- 제목 영역 (고정 높이) -->
    <header class="py-12 text-center">
      <h1 class="text-2xl font-bold">제목</h1>
    </header>

    <!-- Canvas 영역 (제목 제외하고 꽉 채움) -->
    <main class="flex-1 flex justify-center items-center">
      <div class="w-5/6 h-5/6">
        <Canvas />
      </div>
    </main>
  </div>
</template>
