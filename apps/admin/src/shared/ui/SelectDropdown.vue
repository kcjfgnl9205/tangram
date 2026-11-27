<script setup lang="ts">
import { computed } from 'vue'
import Dropdown from './Dropdown.vue'

export interface SelectOption<T extends string | number = string | number> {
  label: string
  value: T
}

const props = withDefaults(
  defineProps<{
    id: string
    options: SelectOption[]
    modelValue?: string | number | null
    placeholder?: string
    align?: 'left' | 'right'
    position?: 'top' | 'bottom'
    disabled?: boolean
  }>(),
  {
    modelValue: null,
    placeholder: '선택',
    align: 'left',
    position: undefined,
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number | null]
}>()

const selectedLabel = computed(
  () => props.options.find((o) => o.value === props.modelValue)?.label ?? props.placeholder,
)

const isSelected = computed(() => props.modelValue !== null && props.modelValue !== undefined)
</script>

<template>
  <Dropdown :id="id" :align="align" :position="position">
    <template #trigger>
      <button
        type="button"
        class="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm min-w-32 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="disabled"
      >
        <span :class="isSelected ? 'text-gray-800' : 'text-gray-400'">{{ selectedLabel }}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 text-gray-400 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </template>

    <template #content="{ close }">
      <ul class="bg-white rounded-lg shadow-lg border border-gray-100 py-1 min-w-32">
        <li v-for="option in options" :key="option.value">
          <button
            type="button"
            class="w-full flex items-center justify-between gap-4 px-4 py-2 text-sm transition-colors"
            :class="
              option.value === modelValue
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-700 hover:bg-gray-50'
            "
            @click="
              () => {
                emit('update:modelValue', option.value)
                close()
              }
            "
          >
            <span>{{ option.label }}</span>
            <svg
              v-if="option.value === modelValue"
              xmlns="http://www.w3.org/2000/svg"
              class="w-3.5 h-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </li>
      </ul>
    </template>
  </Dropdown>
</template>
