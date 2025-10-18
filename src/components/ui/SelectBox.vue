<script setup lang="ts">
import { computed } from 'vue'
import { Label, ErrorLabel } from '@/components/ui'
import { Icon } from '@/components/ui'

export interface SelectOption {
  label: string
  value: string | number
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    label?: string
    options: SelectOption[]
    disabled?: boolean
    error?: string
    required?: boolean
    icon?: string
    placeholder?: string
  }>(),
  { options: () => [] },
)

const emit = defineEmits(['update:modelValue'])

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}

const selectClass = computed(() => {
  return [
    'px-4 py-2 rounded-md outline-none border transition-colors duration-200',
    props.disabled
      ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed'
      : 'bg-white border-gray-300 focus:border-blue-400 focus:ring-1 focus:ring-blue-200',
  ].join(' ')
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <!-- 라벨 + required 표시 -->
    <div v-if="label" class="flex items-center gap-1">
      <Icon v-if="icon" :icon="icon" class="w-4 h-4" />
      <Label :label="label" />
      <span v-if="required" class="text-red-500 text-sm">*</span>
    </div>

    <select
      :value="modelValue"
      :class="selectClass"
      @change="handleChange"
      v-bind="$attrs"
      :disabled="disabled"
    >
      <option v-if="placeholder" disabled value="">
        {{ placeholder }}
      </option>
      <option v-for="(option, i) in options" :key="i" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <ErrorLabel :error="error" />
  </div>
</template>
