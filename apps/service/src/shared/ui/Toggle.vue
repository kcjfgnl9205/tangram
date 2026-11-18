<script setup lang="ts">
interface Props {
  disabled?: boolean
}

const modelValue = defineModel<boolean>({ default: false })

const props = withDefaults(defineProps<Props>(), { disabled: false })

const toggle = () => {
  modelValue.value = !modelValue.value
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    class="relative w-11 h-6 rounded-full border-none cursor-pointer p-1 transition-colors duration-300"
    :class="[
      modelValue ? 'bg-indigo-500' : 'bg-neutral-300',
      disabled ? 'opacity-50 cursor-not-allowed' : '',
    ]"
    @click="toggle"
  >
    <span
      class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300"
      :class="modelValue ? 'translate-x-5' : 'translate-x-0'"
    />
  </button>
</template>
