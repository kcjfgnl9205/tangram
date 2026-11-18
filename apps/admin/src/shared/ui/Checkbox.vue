<script setup lang="ts">
defineProps<{
  modelValue: boolean
  label?: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()
</script>

<template>
  <label
    class="inline-flex items-center gap-2 cursor-pointer select-none"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
  >
    <div class="relative flex items-center justify-center">
      <input
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        class="peer w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer disabled:cursor-not-allowed"
        @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      />
    </div>
    <span v-if="label" class="text-sm text-gray-700">{{ label }}</span>
  </label>
</template>
