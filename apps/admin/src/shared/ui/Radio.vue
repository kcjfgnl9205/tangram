<script setup lang="ts">
defineProps<{
  modelValue: string | number
  value: string | number
  label?: string
  name?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [string | number]
}>()
</script>

<template>
  <label
    class="inline-flex items-center gap-2 cursor-pointer select-none"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
  >
    <input
      type="radio"
      :value="value"
      :checked="modelValue === value"
      :name="name"
      :disabled="disabled"
      class="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer disabled:cursor-not-allowed"
      @change="emit('update:modelValue', value)"
    />
    <span v-if="label" class="text-sm text-gray-700">{{ label }}</span>
  </label>
</template>
