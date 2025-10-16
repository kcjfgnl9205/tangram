<script setup lang="ts">
import { computed } from 'vue'
import { Label, ErrorLabel } from '@/components/ui'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    disabled?: boolean
    error?: string
    required?: boolean
    rows?: number
    placeholder?: string
  }>(),
  {
    rows: 6,
  },
)

const emit = defineEmits(['update:modelValue'])

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const textareaClass = computed(() => {
  return [
    'w-full px-4 py-2 rounded-md outline-none border transition-colors duration-200 resize-none',
    props.disabled
      ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed'
      : 'bg-white border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-200',
  ].join(' ')
})
</script>

<template>
  <div class="flex flex-col gap-1 w-full">
    <!-- 라벨 + required 표시 -->
    <div v-if="label" class="flex items-center gap-1">
      <Label :label="label" />
      <span v-if="required" class="text-red-500 text-sm">*</span>
    </div>

    <!-- 텍스트 영역 -->
    <textarea
      :rows="rows"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="textareaClass"
      @input="handleInput"
      v-bind="$attrs"
    ></textarea>

    <ErrorLabel :error="error" />
  </div>
</template>
