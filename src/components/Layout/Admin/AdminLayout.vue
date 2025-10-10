<script setup lang="ts">
import { computed, ref } from 'vue'
import { AdminSidebar } from '@/components/Layout/Admin'
import { ADMIN_SIDEBAR_NAV } from '@/data/const'

const sidebarOpen = ref(false)

const items = computed(() => {
  // return []
  return ADMIN_SIDEBAR_NAV
})

const handleSidebarOpen = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="flex flex-col h-dvh">
    <div class="flex flex-1 min-h-0">
      <!-- 사이드바(PC) -->
      <aside class="w-64 bg-[#242442] text-gray-300 py-3 hidden md:block">
        <AdminSidebar :items="items" />
      </aside>

      <!-- 메인 컨텐츠 -->
      <main class="flex-1 min-h-0 overflow-y-auto bg-[#F4F8FE] p-4 lg:p-12">
        <RouterView />
      </main>
    </div>

    <!-- 사이드바(모바일) -->
    <transition name="slide">
      <aside v-if="sidebarOpen" class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white p-4">
        <AdminSidebar :items="items" />
      </aside>
    </transition>

    <!-- Overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/40 z-40 md:hidden"
      @click="handleSidebarOpen"
    />
  </div>
</template>

<style>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
