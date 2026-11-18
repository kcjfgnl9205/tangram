<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLayoutStore } from '@/shared/stores'
import { navigation, bottomNavigation, type NavLink } from '@/shared/config/navigation'
import { ROUTE_NAME } from '@/shared/config/routes'
import { BaseIcon } from '@/shared/ui'

const route = useRoute()
const layoutStore = useLayoutStore()

const openItems = ref<Set<ROUTE_NAME>>(new Set())

function isActive(item: NavLink): boolean {
  if (route.name === item.name) return true
  return item.activeNames?.includes(route.name as ROUTE_NAME) ?? false
}

function hasActiveChild(item: NavLink): boolean {
  return item.children?.some((child) => isActive(child)) ?? false
}

function toggleItem(name: ROUTE_NAME) {
  if (openItems.value.has(name)) {
    openItems.value.delete(name)
  } else {
    openItems.value.add(name)
  }
}

// 현재 라우트와 일치하는 부모 아코디언 자동 오픈
watch(
  () => route.name,
  () => {
    navigation.forEach((item) => {
      if ('divider' in item) return
      if (item.children && hasActiveChild(item)) {
        openItems.value.add(item.name)
      }
    })
  },
  { immediate: true },
)
</script>

<template>
  <aside class="flex flex-col w-64 h-full bg-gray-900 text-white">
    <!-- Logo -->
    <div class="flex items-center justify-between h-16 px-5 border-b border-gray-700 shrink-0">
      <span class="text-lg font-bold tracking-tight">로고</span>

      <!-- 모바일 닫기 버튼 -->
      <button
        class="md:hidden p-1.5 rounded hover:bg-gray-700 transition-colors"
        aria-label="사이드바 닫기"
        @click="layoutStore.closeSidebar()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-3">
      <ul class="space-y-0.5 px-2">
        <li
          v-for="(item, index) in navigation"
          :key="'divider' in item ? `divider-${index}` : item.name"
        >
          <!-- Divider -->
          <template v-if="'divider' in item">
            <div class="px-1 pt-3 pb-1">
              <div v-if="item.label" class="flex items-center gap-2">
                <span class="text-[10px] font-semibold tracking-widest text-gray-500 uppercase">
                  {{ item.label }}
                </span>
                <div class="flex-1 h-px bg-gray-700" />
              </div>
              <hr v-else class="border-gray-700" />
            </div>
          </template>

          <!-- children이 있는 경우: 아코디언 -->
          <template v-else-if="item.children?.length">
            <button
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              :class="
                hasActiveChild(item)
                  ? 'text-white bg-gray-700'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              "
              @click="toggleItem(item.name)"
            >
              <span class="flex items-center gap-2.5">
                <BaseIcon v-if="item.icon" :name="item.icon" class="w-4 h-4 shrink-0" />
                {{ item.label }}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 transition-transform duration-200"
                :class="openItems.has(item.name) ? 'rotate-180' : ''"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- children 목록 -->
            <Transition name="accordion">
              <ul
                v-if="openItems.has(item.name)"
                class="mt-0.5 ml-2 pl-3 border-l border-gray-700 space-y-0.5"
              >
                <li v-for="child in item.children" :key="child.name">
                  <RouterLink
                    :to="{ name: child.name }"
                    class="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    :class="
                      isActive(child)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    "
                    @click="layoutStore.closeSidebar()"
                  >
                    {{ child.label }}
                  </RouterLink>
                </li>
              </ul>
            </Transition>
          </template>

          <!-- 일반 링크 -->
          <RouterLink
            v-else
            :to="{ name: item.name }"
            class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            :class="
              isActive(item)
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            "
            @click="layoutStore.closeSidebar()"
          >
            <BaseIcon v-if="item.icon" :name="item.icon" class="w-4 h-4 shrink-0" />
            {{ item.label }}
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- Bottom Navigation -->
    <div class="border-t border-gray-700 py-3 shrink-0">
      <ul class="space-y-0.5 px-2">
        <li v-for="item in bottomNavigation" :key="item.name">
          <RouterLink
            :to="{ name: item.name }"
            class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
            :class="
              isActive(item)
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            "
            @click="layoutStore.closeSidebar()"
          >
            <BaseIcon v-if="item.icon" :name="item.icon" class="w-4 h-4 shrink-0" />
            {{ item.label }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
  max-height: 300px;
}
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
