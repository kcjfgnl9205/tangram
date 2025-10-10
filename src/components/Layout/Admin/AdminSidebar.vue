<script setup lang="ts">
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

// import type { NavItem } from '@/data/const'

const props = defineProps<{ items: any[] }>()
const { t } = useI18n()
const route = useRoute()

function isActive(item: any) {
  if (item.divider) return false
  const exact = item.exact ?? true // 기본 exact=true

  if (item.name) {
    if (exact) return route.name === item.name
    return route.matched.some((m) => m.name === item.name)
  }

  return false
}
</script>

<template>
  <nav class="flex flex-col justify-between h-full">
    <div class="overflow-y-scroll h-full mb-12 pb-2 space-y-1">
      <div v-for="(item, i) in items" :key="i" class="group">
        <div v-if="item.divider" class="my-3 border-t border-white/10" />
        <RouterLink
          v-else
          :to="{ name: item.name }"
          class="mx-2 flex items-center gap-3 rounded-lg px-3 py-2 transition font-semibold h-10"
          :class="
            isActive(item) ? 'bg-[#6A1EBB] text-white' : 'group-hover:text-white text-gray-500'
          "
          aria-current="page"
        >
          <!-- <Icon
            v-if="item.icon"
            :icon="item.icon"
            class="w-5 h-5 fill-[#4A4A4A] group-hover:fill-white block"
            :class="isActive(item) ? 'fill-white' : 'fill-[#4A4A4A]'"
          /> -->

          <span class="flex-1 truncate"> {{ t(item.labelKey || '') }}</span>
        </RouterLink>
      </div>
    </div>

    <div class="flex justify-center w-full">AhaSlides 제공 - 약관</div>
  </nav>
</template>
