<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { cloneDeep } from 'lodash-es'
import { RouteNames } from '@/app/router/router-name'
import { useCanvasStore } from '@/entities/canvas'
import { fetchTangramDetail, incrementTangramView } from '@/entities/tangram/api/tangram'
import { Canvas } from '@/widgets/canvas'
import { createObject, getResourceUrl } from '@/shared/lib'
import { useTangramSolver, type ValidationResult } from '@/features/tangram-solver'
import { usePuzzleAnalytics } from '@/features/puzzle-analytics'
import type { Tangram } from '@/shared/types'

const router = useRouter()
const route = useRoute()
const canvasStore = useCanvasStore()
const { objects, originalObjects } = storeToRefs(canvasStore)

const loaded = ref(false)
const tangram = ref<Tangram | null>(null)

const analytics = usePuzzleAnalytics(() =>
  tangram.value
    ? {
        id: tangram.value.id,
        key: tangram.value.key,
        difficulty: tangram.value.difficulty,
      }
    : null,
)

useTangramSolver({
  onProgress: (r: ValidationResult) => {
    console.log(
      `진행도 ${(r.score * 100).toFixed(1)}% (빈: ${(r.uncovered * 100).toFixed(1)}%, 넘침: ${(r.overflow * 100).toFixed(1)}%, 겹침: ${(r.overlap * 100).toFixed(1)}%)`,
    )
  },
  onSolved: (r: ValidationResult) => {
    console.log('정답!', r)
    analytics.completed(Math.round(r.score * 100))
  },
})

onMounted(async () => {
  try {
    if (!route.params.id || !Number(route.params.id)) {
      router.push({ name: RouteNames.NOT_FOUND })
      return
    }

    const id = Number(route.params.id)
    const data = await fetchTangramDetail(id)
    tangram.value = data

    const res = await fetch(getResourceUrl(data.json_url))
    const response = await res.json()

    // 조회수 증가 (1시간에 1회, 비동기 fire-and-forget)
    incrementTangramView(id)

    const arr = []
    for (const obj of response) {
      const item = createObject(obj.type, { ...obj })
      arr.push(item)
    }

    objects.value = cloneDeep(arr)
    originalObjects.value = cloneDeep(arr)
    loaded.value = true

    analytics.start()
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <div class="w-full h-[calc(100dvh-3.5rem)]">
    <!-- Canvas 영역 (제목 제외하고 꽉 채움) -->
    <main class="flex-1 flex justify-center p-4 w-full h-full items-center gap-2">
      <Canvas :loaded="loaded" />
    </main>
  </div>
</template>
