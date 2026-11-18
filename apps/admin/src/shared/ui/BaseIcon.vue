<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps<{
  name: string
}>()

const icons = import.meta.glob('@/assets/icons/*.vue')

const AsyncIcon = computed(() => {
  const key = Object.keys(icons).find((k) => {
    const filename = k.split('/').pop() ?? ''
    return filename === `${props.name}.vue`
  })
  const loader = key ? icons[key] : undefined
  return loader ? defineAsyncComponent(() => loader() as Promise<any>) : null
})
</script>

<template>
  <component :is="AsyncIcon" v-if="AsyncIcon" />
</template>
