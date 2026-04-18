<script setup lang="ts">
defineProps<{ label?: string }>()
</script>

<template>
  <label v-if="label" class="text-sm ml-1">{{ label }}</label>
</template>
