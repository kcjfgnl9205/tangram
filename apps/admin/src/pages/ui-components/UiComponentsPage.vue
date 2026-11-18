<script setup lang="ts">
import { ref, watch } from 'vue'
import { Button, Input, Checkbox, Radio, Textarea, Tooltip, SelectDropdown } from '@/shared/ui'
import { ConfirmModal, AlertModal } from '@/shared/modal'

import type { SelectOption } from '@/shared/ui'
import { useModalStore, useToastStore } from '@/shared/stores'
import type { ToastType, ToastPosition } from '@/shared/stores'

const modalStore = useModalStore()

function openStacked() {
  modalStore.onOpen(
    ConfirmModal,
    {
      title: '첫 번째 모달',
      description: '확인을 누르면 두 번째 모달이 위에 열립니다. M1은 유지됩니다.',
      confirmText: 'M2 열기',
      keepOpenOnConfirm: true,
      onConfirm: () => {
        modalStore.onOpen(
          AlertModal,
          { type: 'info', title: '두 번째 모달', message: '닫으면 첫 번째 모달이 남아있습니다.' },
          { transition: 'right' },
        )
      },
    },
    { transition: 'up' },
  )
}

// Button
const isLoading = ref(false)
function handleLoading() {
  isLoading.value = true
  setTimeout(() => (isLoading.value = false), 2000)
}

// Input
const inputValue = ref('')
const inputError = ref('')
function validateInput() {
  inputError.value = inputValue.value ? '' : '필수 항목입니다.'
}

// Checkbox
const check1 = ref(false)
const check2 = ref(true)

// Radio
const radioValue = ref('b')
const radioOptions = [
  { value: 'a', label: '옵션 A' },
  { value: 'b', label: '옵션 B' },
  { value: 'c', label: '옵션 C' },
]

// Select
const selectValue = ref<string | number | null>(null)
const selectOptions: SelectOption[] = [
  { label: '서울', value: 'seoul' },
  { label: '부산', value: 'busan' },
  { label: '대구', value: 'daegu' },
  { label: '인천', value: 'incheon' },
]

// Textarea
const textareaValue = ref('')

// Toast
const toastStore = useToastStore()

const toastPositionOptions: SelectOption[] = [
  { label: '오른쪽 상단', value: 'top-right' },
  { label: '왼쪽 상단', value: 'top-left' },
  { label: '상단 중앙', value: 'top' },
  { label: '오른쪽 하단', value: 'bottom-right' },
  { label: '왼쪽 하단', value: 'bottom-left' },
  { label: '하단 중앙', value: 'bottom' },
]

const toastPosition = ref<string | number | null>(toastStore.position)

watch(toastPosition, (v) => {
  if (v) toastStore.position = v as ToastPosition
})

const toastMessages: Record<ToastType, string> = {
  info: '정보 메시지입니다.',
  success: '성공적으로 처리되었습니다.',
  warning: '주의가 필요합니다.',
  error: '오류가 발생했습니다.',
}

function showToast(type: ToastType, duration?: number) {
  toastStore.add(toastMessages[type], type, duration !== undefined ? { duration } : {})
}
</script>

<template>
  <div class="space-y-6 max-w-3xl">
    <!-- Button -->
    <section class="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 class="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">Button</h2>

      <div class="space-y-3">
        <p class="text-xs text-gray-500 font-medium uppercase tracking-wide">Variants</p>
        <div class="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>

      <div class="space-y-3">
        <p class="text-xs text-gray-500 font-medium uppercase tracking-wide">Sizes</p>
        <div class="flex flex-wrap items-center gap-2">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div class="space-y-3">
        <p class="text-xs text-gray-500 font-medium uppercase tracking-wide">States</p>
        <div class="flex flex-wrap items-center gap-2">
          <Button disabled>Disabled</Button>
          <Button variant="secondary" disabled>Disabled</Button>
          <Button :loading="isLoading" @click="handleLoading">
            {{ isLoading ? '로딩 중...' : 'Loading 테스트' }}
          </Button>
        </div>
      </div>
    </section>

    <!-- Input -->
    <section class="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 class="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">Input</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          v-model="inputValue"
          label="기본 인풋"
          placeholder="텍스트를 입력하세요"
          :error="inputError"
          @blur="validateInput"
        />
        <Input label="비활성 상태" placeholder="입력 불가" disabled />
        <Input label="에러 상태" placeholder="이메일 입력" error="올바른 이메일 형식이 아닙니다." />
      </div>
    </section>

    <!-- Checkbox -->
    <section class="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 class="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">Checkbox</h2>

      <div class="flex flex-wrap gap-6">
        <Checkbox v-model="check1" label="동의합니다" />
        <Checkbox v-model="check2" label="선택됨" />
        <Checkbox :model-value="false" label="비활성" disabled />
        <Checkbox :model-value="true" label="비활성 선택됨" disabled />
      </div>
      <p class="text-xs text-gray-400">check1: {{ check1 }} / check2: {{ check2 }}</p>
    </section>

    <!-- Radio -->
    <section class="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 class="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">Radio</h2>

      <div class="flex flex-wrap gap-6">
        <Radio
          v-for="opt in radioOptions"
          :key="opt.value"
          v-model="radioValue"
          :value="opt.value"
          :label="opt.label"
          name="sample-radio"
        />
        <Radio :model-value="''" value="disabled" label="비활성" name="sample-radio" disabled />
      </div>
      <p class="text-xs text-gray-400">선택됨: {{ radioValue }}</p>
    </section>

    <!-- Select -->
    <section class="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 class="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">Select</h2>

      <div class="flex flex-wrap items-center gap-4">
        <SelectDropdown
          id="sample-select"
          v-model="selectValue"
          :options="selectOptions"
          placeholder="지역 선택"
        />
        <SelectDropdown
          id="sample-select-disabled"
          :options="selectOptions"
          placeholder="비활성"
          disabled
        />
      </div>
      <p class="text-xs text-gray-400">선택됨: {{ selectValue ?? '없음' }}</p>
    </section>

    <!-- Textarea -->
    <section class="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 class="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">Textarea</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Textarea v-model="textareaValue" label="내용" placeholder="내용을 입력하세요" :rows="3" />
        <Textarea
          label="에러 상태"
          placeholder="내용 입력"
          error="최소 10자 이상 입력해주세요."
          :rows="3"
        />
        <Textarea label="비활성 상태" placeholder="입력 불가" disabled :rows="3" />
      </div>
    </section>

    <!-- Tooltip -->
    <section class="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 class="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">Tooltip</h2>

      <div class="flex flex-wrap gap-4 py-4">
        <Tooltip content="위쪽 툴팁" placement="top">
          <Button variant="secondary" size="sm">Top</Button>
        </Tooltip>
        <Tooltip content="아래쪽 툴팁" placement="bottom">
          <Button variant="secondary" size="sm">Bottom</Button>
        </Tooltip>
        <Tooltip content="왼쪽 툴팁" placement="left">
          <Button variant="secondary" size="sm">Left</Button>
        </Tooltip>
        <Tooltip content="오른쪽 툴팁" placement="right">
          <Button variant="secondary" size="sm">Right</Button>
        </Tooltip>
      </div>
    </section>

    <!-- Modal -->
    <section class="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 class="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">Modal</h2>

      <div class="flex flex-wrap gap-2">
        <Button @click="openStacked">모달 스택 테스트</Button>
      </div>
    </section>

    <!-- Toast -->
    <section class="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <h2 class="text-base font-semibold text-gray-800 border-b border-gray-100 pb-3">Toast</h2>

      <div class="flex flex-wrap items-end gap-4">
        <SelectDropdown
          id="toast-position"
          v-model="toastPosition"
          :options="toastPositionOptions"
          placeholder="위치 선택"
        />
      </div>

      <div class="space-y-3">
        <p class="text-xs text-gray-500 font-medium uppercase tracking-wide">Types</p>
        <div class="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" @click="showToast('info')">Info</Button>
          <Button variant="secondary" size="sm" @click="showToast('success')">Success</Button>
          <Button variant="secondary" size="sm" @click="showToast('warning')">Warning</Button>
          <Button variant="danger" size="sm" @click="showToast('error')">Error</Button>
        </div>
      </div>
    </section>
  </div>
</template>
