<script setup lang="ts">
import { useRouter } from 'vue-router'
import { LanguageSwitcher } from '@/components/ui'
import { RouteNames } from '@/router'

const router = useRouter()
const handleLogoClick = () => {
  router.push({ name: RouteNames.TANGRAM_LIST })
}
</script>

<template>
  <header class="w-full sticky top-0 z-[100] bg-white/70 backdrop-blur-md">
    <div
      class="max-w-[1280px] px-4 flex justify-between items-center m-auto h-14 text-base leading-5"
    >
      <div class="text-lg font-bold cursor-pointer" @click="handleLogoClick">Tangram</div>
      <div><LanguageSwitcher /></div>
    </div>
  </header>
</template>
