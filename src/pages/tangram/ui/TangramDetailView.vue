<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { cloneDeep } from 'lodash-es'
import { RouteNames } from '@/app/router/router-name'
import { useCanvasStore } from '@/entities/canvas'
import { useMetaStore } from '@/entities/meta'
import { fetchTangramDetail, incrementTangramView } from '@/entities/tangram/api/tangram'
import { Canvas } from '@/widgets/canvas'
import { GameHeader } from '@/widgets/game-header'
import { createObject, getResourceUrl } from '@/shared/lib'
import { useTangramSolver, type ValidationResult } from '@/features/tangram-solver'
import { usePuzzleAnalytics } from '@/features/puzzle-analytics'
import type { Locale, Tangram } from '@/shared/types'

const router = useRouter()
const route = useRoute()
const canvasStore = useCanvasStore()
const metaStore = useMetaStore()
const { locale } = useI18n()
const { objects, originalObjects } = storeToRefs(canvasStore)

const loaded = ref(false)
const tangram = ref<Tangram | null>(null)

// 퍼즐 key → 번역된 제목
const title = computed(() =>
  tangram.value ? metaStore.getText(tangram.value.key, locale.value as Locale) : '',
)

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
  <div class="w-full h-[100dvh]">
    <main class="relative w-full h-full flex justify-center items-center p-4 overflow-hidden">
      <Canvas :loaded="loaded" />
      <GameHeader :title="title" />
    </main>
  </div>
</template>
