import { ref, computed, markRaw, watch, type Component } from 'vue'
import { defineStore } from 'pinia'


type ModalTransition = 'up' | 'down' | 'left' | 'right'

interface ModalOptions {
  transition?: ModalTransition
  isDark?: boolean
  isBackgroundClose?: boolean
}

export interface Modal {
  id: number
  component: Component
  props: Record<string, unknown>
  options: Required<ModalOptions>
  visible: boolean // false = leave 애니메이션 중
}

let _nextId = 0

export const useModalStore = defineStore('v2_modal', () => {
  const modals = ref<Modal[]>([])
  const portalVisible = ref(false)

  // 하나라도 visible인 모달이 있으면 open
  const isOpen = computed(() => modals.value.some((m) => m.visible))

  // 가장 위에 있는 visible 모달 기준으로 옵션 적용
  const topModal = computed(() => [...modals.value].reverse().find((m) => m.visible) ?? null)
  const isDark = computed(() => topModal.value?.options.isDark ?? true)
  const isBackgroundClose = computed(() => topModal.value?.options.isBackgroundClose ?? false)

  function onOpen(
    component: Component,
    props: Record<string, unknown> = {},
    options: ModalOptions = {},
  ) {
    const alreadyOpen = modals.value.some((m) => m.component === component && m.visible)
    if (alreadyOpen) return

    modals.value.push({
      id: _nextId++,
      component: markRaw(component),
      props,
      options: {
        transition: options.transition ?? 'up',
        isDark: options.isDark ?? false,
        isBackgroundClose: options.isBackgroundClose ?? false,
      },
      visible: true,
    })
    portalVisible.value = true
  }

  // 백드롭 클릭 등 - 가장 위 visible 모달 닫기
  function onClose() {
    const closing = [...modals.value].reverse().find((m) => m.visible)
    if (!closing) return
    closing.visible = false
  }

  // 특정 모달을 id로 직접 닫기 (각 모달이 자신을 닫을 때 사용)
  function closeById(id: number) {
    const modal = modals.value.find((m) => m.id === id)
    if (modal) modal.visible = false
  }

  // 각 모달의 <Transition @after-leave> 에서 호출
  function afterLeave(id: number) {
    const index = modals.value.findIndex((m) => m.id === id)
    if (index !== -1) modals.value.splice(index, 1)

    if (modals.value.length === 0) {
      portalVisible.value = false
    }
  }

  // inert 동기화: 모달이 열려 있으면 body 직계 자식(모달 포탈 제외)에 inert 설정
  // federation 환경에서도 호스트 앱의 #app을 직접 참조하지 않아 안전
  watch(isOpen, (open) => {
    const bodyChildren = document.body.children
    for (let i = 0; i < bodyChildren.length; i++) {
      const el = bodyChildren[i] as HTMLElement
      // 모달 Teleport가 삽입한 요소는 제외 (modalStore.portalVisible과 연동)
      if (el.hasAttribute('data-modal-portal')) continue
      if (open) {
        el.setAttribute('inert', '')
      } else {
        el.removeAttribute('inert')
      }
    }
  })

  return {
    modals,
    portalVisible,
    isOpen,
    isDark,
    isBackgroundClose,
    onOpen,
    onClose,
    closeById,
    afterLeave,
  }
})
