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
  return 'px-4 py-2 bg-white rounded-md outline-none border border-gray-300'
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
    />
    <ErrorLabel :error="error" />
  </div>
</template>
