<script setup lang="ts">
import { THEMES, useThemeStore, type ThemeId } from '@/entities/theme'

const themeStore = useThemeStore()

const onChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value as ThemeId
  themeStore.setTheme(value)
}
</script>

<template>
  <select
    :value="themeStore.themeId"
    class="px-2 py-1 text-sm rounded-md border border-neutral-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-300"
    @change="onChange"
  >
    <option v-for="t in THEMES" :key="t.id" :value="t.id">{{ t.label }}</option>
  </select>
</template>
