<script setup lang="ts">
import { Canvas } from '@/components/canvas'
</script>

<template>
  <div class="w-full h-dvh bg-indigo-100 flex flex-col">
    <main class="flex-1 flex justify-center items-center">
      <div class="w-5/6 h-5/6">
        <Canvas />
      </div>
    </main>
  </div>
</template>
