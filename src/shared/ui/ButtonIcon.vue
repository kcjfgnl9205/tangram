<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import Icon from './Icon.vue'
import Tooltip from './Tooltip.vue'

export type ButtonSize = 'default' | 'sm' | 'md' | 'lg'
export interface TooltipType {
  text: string
  position: 'top' | 'bottom'
}
export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  icon?: string
  tooltip?: TooltipType
  selected?: boolean
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'button',

  disabled: false,
  loading: false,
  size: 'default',
  tooltip: undefined,
  selected: false,
  icon: undefined,
})

const attrs = useAttrs()
const emit = defineEmits<{
  click: [event: PointerEvent]
}>()

const isDisabled = computed(() => props.disabled || props.loading)

const sizeClasses: Record<ButtonSize, string> = {
  default: 'w-10 h-10 rounded-lg',
  sm: 'w-6 h-6 rounded-md',
  md: 'w-8 h-8 rounded-lg',
  lg: 'w-12 h-12 rounded-xl',
}

const buttonClass = computed(() => [
  'icon inline-flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none disabled:cursor-not-allowed',
  'text-neutral-500 hover:bg-black/5 disabled:text-neutral-700 disabled:bg-transparent',
  sizeClasses[props.size],
])

const iconSize: Record<ButtonSize, string> = {
  default: 'w-6 h-6',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}
const iconClass = computed(() => [iconSize[props.size]])

const handleClick = (event: PointerEvent) => {
  if (!isDisabled.value) {
    emit('click', event)
  }
}
</script>

<template>
  <Tooltip v-if="tooltip" :position="tooltip.position" :text="tooltip.text">
    <button
      class=""
      :type="type"
      :disabled="isDisabled"
      :class="buttonClass"
      :aria-busy="loading || undefined"
      v-bind="attrs"
      @click="handleClick"
    >
      <Icon v-if="loading" icon="loading-spinner" :class="['animate-spin']" />
      <Icon v-else-if="icon" :icon="icon" aria-hidden="true" :class="iconClass" />
    </button>
  </Tooltip>

  <button
    v-else
    :type="type"
    :disabled="isDisabled"
    :class="buttonClass"
    :aria-busy="loading || undefined"
    v-bind="attrs"
    @click="handleClick"
  >
    <Icon v-if="loading" icon="loading-spinner" :class="['animate-spin']" />
    <Icon v-else-if="icon" :icon="icon" aria-hidden="true" :class="iconClass" />
  </button>
</template>
