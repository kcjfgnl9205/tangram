<script setup lang="ts">
defineProps<{ error?: string }>()
</script>

<template>
  <p v-if="error" class="text-sm text-red-700 ml-2">{{ error }}</p>
</template>
