<script setup lang="ts">
import { computed } from 'vue'
import { Label, ErrorLabel } from '@/components/ui'

export type InputType = 'text' | 'number' | 'email' | 'password'

const props = withDefaults(
  defineProps<{
    type?: InputType
    modelValue: string | number
    label?: string
    disabled?: boolean
    error?: string
  }>(),
  { type: 'text' },
)

const emit = defineEmits(['update:modelValue'])

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  emit('update:modelValue', props.type === 'number' ? Number(value) : value)
}

const inputClass = computed(() => {
  return [
    'px-4 py-2 rounded-md outline-none border transition-colors duration-200',
    props.disabled
      ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed'
      : 'bg-white border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-200',
  ].join(' ')
})
</script>

<template>
  <div class="flex flex-col gap-1 w-fit">
    <Label :label="label" />
    <input
      :type="type"
      :value="modelValue"
      :class="inputClass"
      @input="handleInput"
      v-bind="$attrs"
      :disabled="disabled"
    />
    <ErrorLabel :error="error" />
  </div>
</template>
