<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDropdownStore } from '@/shared/stores'

const props = withDefaults(
  defineProps<{
    id: string
    align?: 'left' | 'right'
    position?: 'top' | 'bottom'
  }>(),
  {
    align: 'left',
    position: undefined,
  },
)

const emit = defineEmits(['update:openId'])
const dropdownStore = useDropdownStore()
const { openId } = storeToRefs(dropdownStore)

const triggerRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const dropdownStyle = ref({})
let resizeObserver: ResizeObserver | null = null

const isOpen = computed(() => openId.value === props.id)

const updatePosition = () => {
  if (!triggerRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()
  const viewportHeight = window.innerHeight

  // dropdown 예상 높이 (실제로 열린 후에 정확한 높이 알 수 있음)
  const estimatedDropdownHeight = dropdownRef.value?.offsetHeight || 200

  // position prop이 있으면 그대로 사용, 없으면 자동 계산
  const spaceBelow = viewportHeight - rect.bottom
  const spaceAbove = rect.top

  const shouldOpenUpward =
    props.position !== undefined
      ? props.position === 'top'
      : spaceBelow < estimatedDropdownHeight && spaceAbove > spaceBelow

  const horizontalPosition =
    props.align === 'right'
      ? { right: `${window.innerWidth - rect.right}px` }
      : { left: `${rect.left}px` }

  if (shouldOpenUpward) {
    // 위로 열기
    dropdownStyle.value = {
      position: 'fixed',
      bottom: `${viewportHeight - rect.top + 8}px`, // 버튼 위에
      ...horizontalPosition,
      minWidth: `${rect.width}px`,
    }
  } else {
    // 아래로 열기 (기본)
    dropdownStyle.value = {
      position: 'fixed',
      top: `${rect.bottom + 8}px`,
      ...horizontalPosition,
      minWidth: `${rect.width}px`,
    }
  }
}

const toggle = () => {
  dropdownStore.toggle(props.id)
}

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as Node
  if (triggerRef.value?.contains(target) || dropdownRef.value?.contains(target)) return
  dropdownStore.close()
}

// ResizeObserver 설정/해제
const setupResizeObserver = () => {
  if (dropdownRef.value && !resizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      updatePosition()
    })
    resizeObserver.observe(dropdownRef.value)
  }
}

const cleanupResizeObserver = () => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
}

// isOpen 변경될 때마다 위치 업데이트
watch(isOpen, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      updatePosition()
      setupResizeObserver()
    }, 0)
    // dropdown이 렌더링된 후 다시 한 번 위치 조정
    setTimeout(updatePosition, 10)
  } else {
    cleanupResizeObserver()
  }
})

onMounted(() => {
  window.addEventListener('scroll', updatePosition, true)
  window.addEventListener('resize', updatePosition)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
  document.removeEventListener('click', handleClickOutside)
  cleanupResizeObserver()
})
</script>

<template>
  <div class="relative dropdown-wrapper">
    <button ref="triggerRef" @click.prevent.stop="toggle" class="flex items-center justify-center">
      <slot name="trigger"></slot>
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="dropdownRef"
        :style="dropdownStyle"
        class="absolute z-999"
        @click.stop
      >
        <slot name="content" :close="() => dropdownStore.close()"></slot>
      </div>
    </Teleport>
  </div>
</template>
