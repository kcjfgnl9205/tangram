<script setup lang="ts">
import { defineProps, withDefaults, defineEmits, useAttrs, type Component, computed } from 'vue'
import { Loading } from '@/components/ui'

type ButtonType = 'button' | 'submit' | 'reset'
type Variant = 'btn-default' | 'btn-blue' | 'btn-red' // 나중에 여기서 다른 색상 추가 가능

interface ButtonProps {
  type?: ButtonType
  disabled?: boolean
  icon?: Component
  variant?: Variant
  isLoading?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  disabled: false,
  variant: 'btn-default',
  isLoading: false,
})

const attrs = useAttrs() as { class?: unknown }

const emit = defineEmits<{ (e: 'click'): void }>()

const handleClick = (event: MouseEvent) => {
  event.stopPropagation()
  if (!props.disabled) {
    emit('click')
  }
}

// variant별 스타일 매핑
const variantClasses = computed(() => {
  switch (props.variant) {
    case 'btn-blue':
      return 'text-white bg-[#289FFB] hover:bg-[#57b6ff]'
    case 'btn-red':
      return 'text-white bg-red-500 hover:bg-red-600'
    case 'btn-default':
    default:
      return 'text-gray-700 bg-gray-100 hover:bg-gray-200'
  }
})
</script>

<template>
  <button
    :type="props.type"
    class="disabled:bg-neutral-500 disabled:cursor-not-allowed cursor-pointer"
    :class="['px-6 py-3 transition-colors rounded-xl', variantClasses, attrs.class]"
    :disabled="props.disabled || props.isLoading"
    @click="handleClick($event)"
  >
    <Loading v-if="props.isLoading" />
    <slot></slot>
  </button>
</template>
