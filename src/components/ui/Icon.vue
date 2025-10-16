<script setup lang="ts">
import { defineAsyncComponent, shallowRef, watch, type Component } from 'vue'

// props 정의
const props = defineProps<{
  icon?: string
}>()

// glob import (.vue 파일들)
const icons = import.meta.glob<Component>('@/assets/icon/**/*.vue')

// 반응형이지만 내부는 비반응형으로 유지
const AsyncIcon = shallowRef<Component | null>(null)

// 아이콘 로드 함수
const loadIcon = (fileName?: string) => {
  if (!fileName) {
    console.error(`아이콘 이름이 비어 있습니다: ${fileName}`)
    AsyncIcon.value = null
    return
  }

  const matchingIconKey = Object.keys(icons).find((key) => {
    const iconFileName = key.split('/').pop()?.replace('.vue', '')
    return iconFileName === fileName
  })

  if (!matchingIconKey) {
    console.warn(`아이콘 파일을 찾을 수 없습니다: ${fileName}`)
    AsyncIcon.value = null
    return
  }

  // shallowRef이므로 markRaw 불필요
  AsyncIcon.value = defineAsyncComponent(icons[matchingIconKey])
}

// props.iconName 변경 감지
watch(
  () => props.icon,
  (newIconName) => {
    loadIcon(newIconName)
  },
  { immediate: true },
)
</script>

<template>
  <component :is="AsyncIcon" v-if="AsyncIcon" />
</template>
