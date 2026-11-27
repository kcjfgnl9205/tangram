<script setup lang="ts">
import { useAttrs, computed } from 'vue'
import { Loading, Icon } from '@/shared/ui'

type ButtonType = 'button' | 'submit' | 'reset'
export type ButtonSize = 'sm' | 'md'
type Variant = 'btn-default' | 'btn-blue' | 'btn-red' | 'btn-black' // 나중에 여기서 다른 색상 추가 가능

interface ButtonProps {
  type?: ButtonType
  disabled?: boolean
  icon?: string
  variant?: Variant
  size?: ButtonSize
  isLoading?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  disabled: false,
  variant: 'btn-default',
  size: 'md',
  isLoading: false,
})

// 칩·셀렉트 같은 줄에 놓을 때 높이를 맞추기 위한 프리셋
const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-[34px] px-3.5 text-body-sm',
  md: 'px-3 py-2',
}

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
      return 'text-white bg-primary hover:bg-primary-hover'
    case 'btn-red':
      return 'text-white bg-danger hover:bg-danger-hover'
    case 'btn-black':
      return 'text-neutral-50 bg-neutral-900 hover:bg-neutral-600'
    case 'btn-default':
    default:
      return 'text-gray-700 bg-gray-100 hover:bg-gray-200'
  }
})
</script>

<template>
  <button
    :type="props.type"
    class="disabled:bg-neutral-500 disabled:cursor-not-allowed cursor-pointer w-fit inline-flex items-center justify-center gap-2 leading-none"
    :class="['transition-colors rounded-xl', sizeClasses[props.size], variantClasses, attrs.class]"
    :disabled="props.disabled || props.isLoading"
    @click="handleClick($event)"
  >
    <Loading v-if="props.isLoading" size="sm" />
    <Icon v-if="!props.isLoading && props.icon" :icon="icon" />
    <slot></slot>
  </button>
</template>
