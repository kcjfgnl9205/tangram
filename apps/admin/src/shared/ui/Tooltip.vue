<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    content: string
    placement?: 'top' | 'bottom' | 'left' | 'right'
  }>(),
  {
    placement: 'top',
  },
)

const show = ref(false)
</script>

<template>
  <div
    class="relative inline-flex"
    @mouseenter="show = true"
    @mouseleave="show = false"
  >
    <slot />
    <Transition
      enter-active-class="transition-opacity duration-150"
      leave-active-class="transition-opacity duration-100"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-show="show"
        role="tooltip"
        class="absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-md whitespace-nowrap pointer-events-none"
        :class="{
          'bottom-full left-1/2 -translate-x-1/2 mb-2': placement === 'top',
          'top-full left-1/2 -translate-x-1/2 mt-2': placement === 'bottom',
          'right-full top-1/2 -translate-y-1/2 mr-2': placement === 'left',
          'left-full top-1/2 -translate-y-1/2 ml-2': placement === 'right',
        }"
      >
        {{ content }}
      </div>
    </Transition>
  </div>
</template>
