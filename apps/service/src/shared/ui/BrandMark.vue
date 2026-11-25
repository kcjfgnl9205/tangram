<script setup lang="ts">
/**
 * PUZMU 로고 — 칠교 일곱 조각이 모인 정사각형.
 *
 * 좌표는 실제 칠교 분할이다(큰 삼각형 2 · 중간 1 · 작은 2 · 정사각형 · 평행사변형).
 * 헤더·푸터·히어로가 같은 마크를 쓰도록 한 곳에 둔다.
 */
interface Props {
  /** 글자 없이 도형만 */
  iconOnly?: boolean
}
withDefaults(defineProps<Props>(), { iconOnly: false })
</script>

<template>
  <span class="inline-flex items-center gap-2.5 font-bold tracking-tight text-ink">
    <svg viewBox="0 0 100 100" class="w-[26px] h-[26px] shrink-0" aria-hidden="true">
      <polygon points="0,0 100,0 50,50" class="fill-tan-1" />
      <polygon points="0,0 50,50 0,100" class="fill-tan-2" />
      <polygon points="100,50 100,100 50,100" class="fill-tan-3" />
      <polygon points="100,0 100,50 75,25" class="fill-tan-4" />
      <polygon points="50,50 75,25 100,50 75,75" class="fill-tan-5" />
      <polygon points="50,50 25,75 75,75" class="fill-tan-6" />
      <polygon points="0,100 25,75 75,75 50,100" class="fill-tan-7" />
    </svg>
    <span v-if="!iconOnly" class="text-[19px] leading-none">PUZMU</span>
  </span>
</template>
