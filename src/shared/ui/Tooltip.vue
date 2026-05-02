<script setup lang="ts">
import { ref, nextTick } from 'vue'

interface Props {
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  position: 'top',
})

const triggerRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const pos = ref({ top: '0px', left: '0px' })

const show = async () => {
  isVisible.value = true
  await nextTick()
  if (!triggerRef.value || !tooltipRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()
  const tt = tooltipRef.value.getBoundingClientRect()
  const gap = 8

  let top: number
  let left: number

  if (props.position === 'right') {
    top = rect.top + rect.height / 2 - tt.height / 2
    left = rect.right + gap + 4
  } else if (props.position === 'left') {
    top = rect.top + rect.height / 2 - tt.height / 2
    left = rect.left - tt.width - gap - 4
  } else if (props.position === 'bottom') {
    top = rect.bottom + gap
    left = rect.left + rect.width / 2 - tt.width / 2
  } else {
    top = rect.top - tt.height - gap
    left = rect.left + rect.width / 2 - tt.width / 2
  }

  pos.value = { top: `${top}px`, left: `${left}px` }
}

const hide = () => {
  isVisible.value = false
}
</script>

<template>
  <div ref="triggerRef" class="flex" @mouseenter="show" @mouseleave="hide">
    <slot />

    <Teleport v-if="isVisible" to="body">
      <div
        ref="tooltipRef"
        class="min-w-11 fixed bg-[#3D3D3D] text-white text-caption rounded-lg p-2 z-[9999] whitespace-nowrap pointer-events-none text-center"
        :style="{ top: pos.top, left: pos.left }"
      >
        <svg
          v-if="position === 'top'"
          class="absolute top-full -mt-[1px] left-1/2 -translate-x-1/2 fill-[#3D3D3D] stroke-[#3D3D3D]"
          width="16"
          height="8"
          viewBox="0 0 16 8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.29289 7.29289C7.68342 7.68342 8.31658 7.68342 8.70711 7.29289L16 0H0L7.29289 7.29289Z"
          />
        </svg>
        <svg
          v-else-if="position === 'bottom'"
          class="absolute bottom-full -mb-[1px] left-1/2 -translate-x-1/2 fill-[#3D3D3D] stroke-[#3D3D3D]"
          width="16"
          height="8"
          viewBox="0 0 16 8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.29289 0.293044C7.68342 -0.0974807 8.31658 -0.0974799 8.70711 0.293044L16 7.58594H0L7.29289 0.293044Z"
          />
        </svg>
        <!-- left: 툴팁이 왼쪽, 화살표는 오른쪽을 가리킴 -->
        <svg
          v-else-if="position === 'left'"
          width="8"
          height="16"
          viewBox="0 0 8 16"
          xmlns="http://www.w3.org/2000/svg"
          class="absolute left-full top-1/2 -translate-y-1/2 -ml-[1px] fill-[#3D3D3D]"
        >
          <path d="M7.6 9.067C8.133 8.533 8.133 7.467 7.6 6.933L0.667 0V16L7.6 9.067Z" />
        </svg>
        <!-- right: 툴팁이 오른쪽, 화살표는 왼쪽을 가리킴 -->
        <svg
          v-else-if="position === 'right'"
          width="8"
          height="16"
          viewBox="0 0 8 16"
          xmlns="http://www.w3.org/2000/svg"
          class="absolute right-full top-1/2 -translate-y-1/2 -mr-[1px] fill-[#3D3D3D]"
        >
          <path d="M0.4 9.067C-0.133 8.533 -0.133 7.467 0.4 6.933L7.333 0V16L0.4 9.067Z" />
        </svg>
        {{ text }}
      </div>
    </Teleport>
  </div>
</template>
