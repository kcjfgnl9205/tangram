<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useModalStore } from '@/shared/stores/modal.store'

const modalStore = useModalStore()

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
      <Transition name="modal-fade" appear>
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
          :name="`modal-${modal.options.transition}`"
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

<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-up-enter-active,
.modal-up-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-up-enter-from,
.modal-up-leave-to {
  opacity: 0;
  transform: translateY(100px) scale(0.98);
}

.modal-down-enter-active,
.modal-down-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-down-enter-from,
.modal-down-leave-to {
  opacity: 0;
  transform: translateY(-100px) scale(0.98);
}

.modal-left-enter-active,
.modal-left-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-left-enter-from,
.modal-left-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}

.modal-right-enter-active,
.modal-right-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-right-enter-from,
.modal-right-leave-to {
  opacity: 0;
  transform: translateX(100px);
}
</style>
