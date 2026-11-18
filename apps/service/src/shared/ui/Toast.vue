<script setup lang="ts">
import { computed } from 'vue'
import { useToastStore, type ToastPosition } from '@/shared/stores/toast.store'
import { Icon } from '@/shared/ui'

const store = useToastStore()

const posMap: Record<string, string> = {
  'top-left': 'top-4 left-4 items-start',
  'top-right': 'top-4 right-4 items-end',
  top: 'top-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-left': 'bottom-4 left-4 items-start',
  'bottom-right': 'bottom-4 right-4 items-end',
  bottom: 'bottom-4 left-1/2 -translate-x-1/2 items-center',
}

const positions = computed(() => {
  const groups = new Map<ToastPosition, typeof store.toasts>()
  for (const toast of store.toasts) {
    if (!groups.has(toast.position)) {
      groups.set(toast.position, [])
    }
    groups.get(toast.position)!.push(toast)
  }
  return groups
})

function getContainerClass(pos: ToastPosition) {
  const isTop = pos.startsWith('top')
  return [posMap[pos], isTop ? 'flex-col-reverse' : 'flex-col']
}

function getTransitionName(pos: ToastPosition) {
  return pos.startsWith('top') ? 'toast-top' : 'toast-bottom'
}

//TODO: 나중에 info 지우기
const typeConfig = {
  info: {
    icon: 'circle-check-icon',
    color: 'text-green-300',
  },
  success: {
    icon: 'circle-check-icon',
    color: 'text-blue-300',
  },
  error: {
    icon: 'alert-icon',
    color: 'text-red-300',
  },
}
</script>

<template>
  <Teleport to="body">
    <template v-for="[pos, toasts] in positions" :key="pos">
      <TransitionGroup
        tag="div"
        :name="getTransitionName(pos)"
        class="fixed z-[300] flex gap-2 pointer-events-none"
        :class="getContainerClass(pos)"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto w-full bg-[#1A1A1ACC] rounded-[0.625rem] shadow-dropdown overflow-hidden flex"
        >
          <div class="flex items-center gap-10 px-4 py-2.5 flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <Icon
                :icon="typeConfig[toast.type].icon"
                :class="typeConfig[toast.type].color"
                class="w-5 h-5"
              />
              <span class="flex-1 text-body-sm font-medium text-white">
                {{ toast.message }}
              </span>
            </div>
            <Icon
              icon="x-close-icon"
              class="w-5 h-5 text-white hover:text-gray-600 hover:bg-gray-100 transition-colors rounded-md cursor-pointer"
              @click="store.remove(toast.id)"
            />
          </div>
        </div>
      </TransitionGroup>
    </template>
  </Teleport>
</template>

<style>
/* 위에서 나타나는 위치 (top-*) */
.toast-top-enter-active,
.toast-top-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-top-enter-from,
.toast-top-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
.toast-top-leave-active {
  position: absolute;
}
.toast-top-move {
  transition: transform 0.25s ease;
}

/* 아래서 나타나는 위치 (bottom-*) */
.toast-bottom-enter-active,
.toast-bottom-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-bottom-enter-from,
.toast-bottom-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
.toast-bottom-leave-active {
  position: absolute;
}
.toast-bottom-move {
  transition: transform 0.25s ease;
}
</style>
