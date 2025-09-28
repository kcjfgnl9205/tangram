<script setup lang="ts">
import { LanguageSwitcher } from '@/components/ui'
</script>

<template>
  <header class="w-full sticky top-0 z-[100] bg-white/70 backdrop-blur-md">
    <div
      class="max-w-[1280px] px-4 flex justify-between items-center m-auto h-14 text-base leading-5"
    >
      <div class="text-lg font-bold">Tangram</div>
      <div><LanguageSwitcher /></div>
    </div>
  </header>
</template>
