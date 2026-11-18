<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    placeholder?: string
    rows?: number
    error?: string
    disabled?: boolean
    required?: boolean
  }>(),
  {
    modelValue: '',
    rows: 4,
    disabled: false,
    required: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [string]
}>()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" class="text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-0.5">*</span>
    </label>
    <textarea
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      class="w-full px-3 py-2 text-sm rounded-lg border transition-colors outline-none focus:ring-2 focus:ring-offset-0 resize-y disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
      :class="
        error
          ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
      "
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    />
    <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
  </div>
</template>
