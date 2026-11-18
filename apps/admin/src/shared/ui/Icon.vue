<script setup lang="ts">
import { defineAsyncComponent, watch } from 'vue'

interface Props {
  icon: string
}
const props = defineProps<Props>()

const icons: any = import.meta.glob('@/assets/icons/**/*.vue')
let AsyncIcon: any = null

const loadIcon = (fileName: string) => {
  try {
    if (!fileName) throw new Error(`아이콘 이름에 대한 파일 이름을 찾을 수 없습니다: ${fileName}`)

    const matchingIconKey = Object.keys(icons).find((key) => {
      const iconFileName = key.split('/').pop()?.replace('-icon.vue', '')
      return iconFileName === fileName
    })

    if (!matchingIconKey) throw new Error(fileName + `아이콘 파일을 찾을 수 없습니다: ${fileName}`)

    AsyncIcon = defineAsyncComponent(() => icons[matchingIconKey]())
  } catch (e) {
    AsyncIcon = null
    console.error(e)
  }
}

watch(
  () => props.icon,
  (newIcon) => {
    if (newIcon) loadIcon(newIcon)
  },
  { immediate: true },
)
</script>

<template>
  <component :is="AsyncIcon" v-if="AsyncIcon" class="icon" />
</template>
