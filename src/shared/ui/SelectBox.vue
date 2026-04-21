<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import Label from './Label.vue'
import Icon from './Icon.vue'

interface Option {
  label: string
  value: string | number
}

interface SelectProps {
  modelValue: string | number | null
  label?: string
  placeholder?: string
  options: Option[]
  disabled?: boolean
  error?: string
  required?: boolean
  icon?: string
}

defineOptions({ inheritAttrs: false })

const { t } = useI18n()

const props = withDefaults(defineProps<SelectProps>(), {
  label: undefined,
  placeholder: undefined,
  disabled: false,
  required: false,
  error: undefined,
  icon: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
}>()

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLElement | null>(null)
const dropdownPos = ref({ top: 0, left: 0, width: 0 })
const openUpward = ref(false) // 위쪽으로 열릴지 여부

onClickOutside(containerRef, () => (isOpen.value = false))

const selectedLabel = computed(() => {
  const match = props.options.find((o) => o.value === props.modelValue)
  return match ? match.label : ''
})

function openDropdown() {
  if (props.disabled) return
  if (!triggerRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const spaceBelow = viewportHeight - rect.bottom
  const spaceAbove = rect.top

  // 드롭다운 예상 높이 (최대 300px로 가정)
  const dropdownHeight = Math.min(props.options.length * 40 + 16, 300)

  // 아래 공간이 부족하고 위 공간이 더 많으면 위로 열기
  openUpward.value = spaceBelow < dropdownHeight && spaceAbove > spaceBelow

  if (openUpward.value) {
    dropdownPos.value = {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
    }
  } else {
    dropdownPos.value = {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
    }
  }

  isOpen.value = !isOpen.value
}

function handleSelect(option: Option) {
  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
}

// 윈도우 리사이즈 시 드롭다운 위치 갱신
function handleResize() {
  if (!isOpen.value || !triggerRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const spaceBelow = viewportHeight - rect.bottom
  const spaceAbove = rect.top
  const dropdownHeight = Math.min(props.options.length * 40 + 16, 300)

  openUpward.value = spaceBelow < dropdownHeight && spaceAbove > spaceBelow

  if (openUpward.value) {
    dropdownPos.value = {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
    }
  } else {
    dropdownPos.value = {
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
    }
  }
}
onMounted(() => window.addEventListener('resize', handleResize))
onBeforeUnmount(() => window.removeEventListener('resize', handleResize))
</script>

<template>
  <div ref="containerRef" class="flex flex-col gap-1 w-full">
    <Label v-if="label" :required="required">{{ label }}</Label>

    <!-- 트리거 -->
    <div
      ref="triggerRef"
      class="w-full py-[0.6875rem] h-[2.5rem] px-3 border rounded-lg transition-all flex justify-between items-center text-body-sm-normal"
      :class="[
        props.disabled
          ? 'bg-neutral-100 text-[#aaa] cursor-not-allowed border-neutral-300'
          : 'bg-white text-neutral-800 cursor-pointer',
        isOpen ? 'border-neutral-700' : 'border-neutral-300 hover:border-neutral-500',
      ]"
      @click="openDropdown"
    >
      <span class="truncate">
        {{ selectedLabel || props.placeholder || t('shared.placeholder.select') }}
      </span>
      <Icon
        :icon="props.icon ?? 'chevron-down-icon'"
        class="transition-transform"
        :class="{ 'rotate-180': isOpen && !props.icon }"
      />
    </div>

    <!-- Teleport로 body에 렌더링 -->
    <Teleport to="body">
      <transition name="fade">
        <ul
          v-if="isOpen"
          class="select-dropdown-teleport absolute z-[9999] bg-white border border-neutral-900 rounded-[0.625rem] shadow-dropdown overflow-auto p-2 mt-1"
          :class="{ 'origin-bottom': openUpward, 'origin-top': !openUpward }"
          :style="{
            top: openUpward ? 'auto' : dropdownPos.top + 'px',
            bottom: openUpward ? `calc(100vh - ${dropdownPos.top}px)` : 'auto',
            left: dropdownPos.left + 'px',
            width: dropdownPos.width + 'px',
            position: 'absolute',
            maxHeight: '388px',
          }"
          @pointerdown.prevent
        >
          <li
            v-for="option in props.options"
            :key="option.value"
            class="flex justify-between p-2 cursor-pointer text-neutral-500 text-sm hover:bg-neutral-100 rounded-md"
            @click="handleSelect(option)"
          >
            <span>{{ option.label }}</span>
            <Icon
              v-if="modelValue === option.value"
              icon="check-icon"
              class="w-6 h-6 text-blue-500"
            >
              {{ option.label }}
            </Icon>
          </li>
        </ul>
      </transition>
    </Teleport>

    <p v-if="props.error" class="text-sm text-red-500">{{ props.error }}</p>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
