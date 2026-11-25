<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useModalStore } from '@/shared/stores/modal.store'

const modalStore = useModalStore()

// 등장/퇴장 각본은 base.css 의 --animate-* 토큰이 소유한다 (rules/36).
// 여기서는 방향 → 토큰 이름만 고른다.
const TRANSITION_CLASS = {
  up: { enter: 'animate-dialog-up-in', leave: 'animate-dialog-up-out' },
  down: { enter: 'animate-dialog-down-in', leave: 'animate-dialog-down-out' },
  left: { enter: 'animate-slide-in-left', leave: 'animate-slide-out-left' },
  right: { enter: 'animate-slide-in-right', leave: 'animate-slide-out-right' },
} as const

function handleBackdropClick() {
  // NOTE: 배경 클릭으로 모달을 닫지 않도록 비활성화.
  // (요구사항) 모달은 버튼 액션을 통해서만 닫힌다.
  // if (modalStore.isBackgroundClose) {
  //   modalStore.onClose()
  // }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    modalStore.onClose()
  }
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <div v-if="modalStore.portalVisible" data-modal-portal>
      <!-- 백드롭: 가장 위의 visible 모달 기준 -->
      <Transition enter-active-class="animate-fade-in" leave-active-class="animate-fade-out" appear>
        <div
          v-if="modalStore.isOpen"
          class="fixed inset-0 z-[100]"
          :class="modalStore.isDark ? 'bg-black/50' : 'bg-[#29292933]'"
          @click="handleBackdropClick"
        />
      </Transition>

      <!-- 모달 스택: 모두 렌더, z-index로 쌓기 -->
      <!-- 모바일에선 padding 제거 → 자식이 w-full/h-full 로 화면을 꽉 채울 수 있음 -->
      <div
        v-for="(modal, index) in modalStore.modals"
        :key="modal.id"
        class="fixed inset-0 flex items-center justify-center pointer-events-none md:p-4"
        :style="{ zIndex: 101 + index }"
      >
        <Transition
          :enter-active-class="TRANSITION_CLASS[modal.options.transition].enter"
          :leave-active-class="TRANSITION_CLASS[modal.options.transition].leave"
          appear
          @after-leave="() => modalStore.afterLeave(modal.id)"
        >
          <div
            v-if="modal.visible"
            class="pointer-events-auto w-screen h-dvh flex items-center justify-center md:block md:w-auto md:h-auto"
            @click.stop
          >
            <component
              :is="modal.component"
              v-bind="modal.props"
              @close="() => modalStore.closeById(modal.id)"
            />
          </div>
        </Transition>
      </div>
    </div>
  </Teleport>
</template>
