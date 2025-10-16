<script setup lang="ts">
import { Icon } from '@/components/ui'
import type { BadgeType } from '@/types'

interface Props {
  type: BadgeType
  text: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'green',
})
</script>

<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded-2xl text-xs font-medium w-fit gap-1"
    :class="{
      'bg-green-100 text-green-800': props.type === 'green',
      'bg-yellow-100 text-yellow-800': props.type === 'yellow',
      'bg-red-100 text-red-800': props.type === 'red',
    }"
  >
    {{ props.text }}
    <template v-if="props.icon">
      <Icon :icon="props.icon" />
    </template>
  </span>
</template>
