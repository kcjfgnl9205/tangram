<script setup lang="ts">
interface Props {
  required?: boolean
}
defineOptions({ inheritAttrs: false })

const { required = false } = defineProps<Props>()
</script>

<template>
  <span class="relative inline-block font-medium text-neutral-700">
    <slot></slot>
    <span v-if="required" class="absolute top-0 ml-1 text-red-500 text-xs">*</span>
  </span>
</template>
