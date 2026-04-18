<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

const minutes = ref('00')
const seconds = ref('00')

let startTime = 0
let interval: number | null = null

const update = () => {
  const diff = performance.now() - startTime
  const m = Math.floor(diff / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  const ms = diff % 1000
  minutes.value = String(m).padStart(2, '0')
  seconds.value = String(s).padStart(2, '0')
}

const start = () => {
  startTime = performance.now()
  interval = window.setInterval(update, 10)
}

const stop = () => {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

const reset = () => {
  stop()
  minutes.value = '00'
  seconds.value = '00'
}

onMounted(() => start())
onUnmounted(() => reset())
onBeforeRouteLeave(() => reset())
</script>

<template>
  <text
    x="990"
    y="50"
    text-anchor="middle"
    dominant-baseline="middle"
    font-size="32"
    font-weight="500"
    fill="#000"
    font-family="'JetBrains Mono', monospace"
  >
    <tspan>{{ minutes }}</tspan>
    <tspan>:</tspan>
    <tspan>{{ seconds }}</tspan>
  </text>
</template>
