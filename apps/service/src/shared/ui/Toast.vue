<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToastStore, type ToastPosition, type ToastType } from '@/shared/stores/toast.store'
import { Icon } from '@/shared/ui'

const store = useToastStore()
const { t } = useI18n()

const posMap: Record<ToastPosition, string> = {
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

const isTop = (pos: ToastPosition) => pos.startsWith('top')

function getContainerClass(pos: ToastPosition) {
  return [posMap[pos], isTop(pos) ? 'flex-col-reverse' : 'flex-col']
}

// 등장/퇴장 각본은 base.css 의 --animate-* 토큰이 소유한다 (rules/36).
// 방향은 출처를 따른다 — 위에 뜨면 위에서, 아래에 뜨면 아래에서 밀려 들어온다.
function getEnterClass(pos: ToastPosition) {
  return isTop(pos) ? 'animate-toast-in-top' : 'animate-toast-in-bottom'
}

// leave 중에는 흐름에서 빼야(absolute) 남은 항목의 move 가 자연스럽다.
function getLeaveClass(pos: ToastPosition) {
  return `absolute ${isTop(pos) ? 'animate-toast-out-top' : 'animate-toast-out-bottom'}`
}

const typeConfig: Record<ToastType, { icon: string; color: string }> = {
  info: { icon: 'circle-check-icon', color: 'text-sky-300' },
  success: { icon: 'circle-check-icon', color: 'text-emerald-300' },
  warning: { icon: 'alert-icon', color: 'text-amber-300' },
  error: { icon: 'alert-icon', color: 'text-red-300' },
}

// 에러·경고는 하던 일을 멈추고 들어야 하므로 assertive, 나머지는 polite.
const liveRole = (type: ToastType) => (type === 'error' || type === 'warning' ? 'alert' : 'status')
</script>

<template>
  <Teleport to="body">
    <template v-for="[pos, toasts] in positions" :key="pos">
      <TransitionGroup
        tag="div"
        :enter-active-class="getEnterClass(pos)"
        :leave-active-class="getLeaveClass(pos)"
        move-class="transition-transform duration-200 ease-out"
        class="fixed z-[300] flex gap-2 pointer-events-none"
        :class="getContainerClass(pos)"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :role="liveRole(toast.type)"
          :aria-live="toast.type === 'error' || toast.type === 'warning' ? 'assertive' : 'polite'"
          class="pointer-events-auto w-full bg-[#1A1A1ACC] rounded-[0.625rem] shadow-dropdown overflow-hidden flex"
        >
          <div class="flex items-start gap-10 px-4 py-2.5 flex-1 min-w-0">
            <div class="flex items-start gap-2 min-w-0">
              <Icon
                :icon="typeConfig[toast.type].icon"
                :class="typeConfig[toast.type].color"
                class="w-5 h-5 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div class="flex flex-col gap-0.5 min-w-0">
                <span class="text-body-sm font-medium text-white">
                  {{ toast.message }}
                </span>
                <span v-if="toast.description" class="text-body-xs text-white/70 line-clamp-2">
                  {{ toast.description }}
                </span>
              </div>
            </div>

            <button
              type="button"
              class="shrink-0 rounded-md p-0.5 cursor-pointer text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              :aria-label="t('common.toast.close')"
              @click="store.remove(toast.id)"
            >
              <Icon icon="x-close-icon" class="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </TransitionGroup>
    </template>
  </Teleport>
</template>
