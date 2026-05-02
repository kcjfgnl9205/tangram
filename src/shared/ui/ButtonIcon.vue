<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import Icon from './Icon.vue'
import Tooltip from './Tooltip.vue'

export type ButtonSize = 'md' | 'sm' | 'lg'
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
  variant: 'normal',
  disabled: false,
  loading: false,
  size: 'md',
  tooltip: undefined,
  selected: false,
})

const attrs = useAttrs()
const emit = defineEmits<{
  click: [event: PointerEvent]
}>()

const isDisabled = computed(() => props.disabled || props.loading)

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-[1.5rem] w-[1.5rem] rounded-full',
  md: 'h-[2rem] w-[2rem] rounded-full',
  lg: 'h-[3rem] w-[3rem] rounded-full',
}

const buttonClass = computed(() => [
  'inline-flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none disabled:cursor-not-allowed',
  'bg-white text-[#333333] hover:bg-[#BDBDBD] disabled:text-[#CCCCCC] disabled:bg-transparent',
  sizeClasses[props.size],
])

const iconSize: Record<ButtonSize, string> = {
  sm: 'h-[1rem] w-[1rem]',
  md: 'h-[1.25rem] w-[1.25rem]',
  lg: 'h-[1.5rem] w-[1.5rem]',
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
