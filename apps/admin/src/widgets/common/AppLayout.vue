<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLayoutStore } from '@/shared/stores'
import { navigation, bottomNavigation, type NavLink } from '@/shared/config/navigation'
import { ROUTE_NAME } from '@/shared/config/routes'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'

const route = useRoute()
const layoutStore = useLayoutStore()

function isNavLinkActive(item: NavLink): boolean {
  if (route.name === item.name) return true
  if (item.activeNames?.includes(route.name as ROUTE_NAME)) return true
  if (item.children?.some((child) => isNavLinkActive(child))) return true
  return false
}

const allNavLinks = computed(() => [
  ...navigation.filter((item): item is NavLink => !('divider' in item)),
  ...bottomNavigation,
])

const activeNav = computed(() => allNavLinks.value.find((item) => isNavLinkActive(item)))
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">
    <!-- 데스크탑: 고정 사이드바 -->
    <div class="hidden md:flex">
      <AppSidebar />
    </div>

    <!-- 모바일: 오버레이 배경 -->
    <Transition name="fade">
      <div
        v-if="layoutStore.isSidebarOpen"
        class="fixed inset-0 z-40 bg-black/50 md:hidden"
        @click="layoutStore.closeSidebar()"
      />
    </Transition>

    <!-- 모바일: 드로어 -->
    <Transition name="slide">
      <div v-if="layoutStore.isSidebarOpen" class="fixed inset-y-0 left-0 z-50 md:hidden">
        <AppSidebar />
      </div>
    </Transition>

    <!-- 오른쪽: 헤더 + 콘텐츠 -->
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">
      <AppHeader :active-nav="activeNav" />
      <main class="flex-1 overflow-y-auto p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
