<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button } from '@/shared/ui'

interface Props {
  durationSec: number
  finalScore: number
  onRetry: () => void
  onConfirm: () => void
}
const props = defineProps<Props>()
const emit = defineEmits<{ close: [] }>()

const { t } = useI18n()

// 경과 시간을 "mm:ss" 또는 "hh:mm:ss" 로 포맷
const durationLabel = computed(() => {
  const total = Math.max(0, Math.floor(props.durationSec))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
})

const handleRetry = () => {
  props.onRetry()
  emit('close')
}

const handleConfirm = () => {
  props.onConfirm()
  emit('close')
}
</script>

<template>
  <div
    class="bg-white rounded-2xl shadow-2xl w-[min(90vw,400px)] overflow-hidden flex flex-col"
    role="dialog"
    aria-labelledby="solved-title"
  >
    <!-- 본문 -->
    <div class="px-6 pt-8 pb-6 text-center">
      <h2 id="solved-title" class="text-2xl font-bold text-neutral-800 mb-6">
        {{ t('tangram.detail.solved.title') }}
      </h2>

      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-xl bg-neutral-100 py-4">
          <p class="text-xs text-neutral-500 mb-1">{{ t('tangram.detail.solved.duration') }}</p>
          <p class="text-xl font-semibold text-neutral-800 tabular-nums">{{ durationLabel }}</p>
        </div>
        <div class="rounded-xl bg-neutral-100 py-4">
          <p class="text-xs text-neutral-500 mb-1">{{ t('tangram.detail.accuracy') }}</p>
          <p class="text-xl font-semibold text-emerald-600 tabular-nums">{{ finalScore }}%</p>
        </div>
      </div>
    </div>

    <!-- 버튼 -->
    <div class="flex gap-2 px-5 pb-5">
      <Button variant="btn-default" class="flex-1" @click="handleRetry">
        {{ t('tangram.detail.solved.retry') }}
      </Button>
      <Button variant="btn-blue" class="flex-1" @click="handleConfirm">
        {{ t('tangram.detail.solved.confirm') }}
      </Button>
    </div>
  </div>
</template>
