<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { RouteNames } from '@/app/router/router-name'
import { useModalStore } from '@/shared/stores/modal.store'
import { ButtonIcon, SelectBox } from '@/shared/ui'
import type { Locale } from '@/shared/types'
import ContactModal from '@/widgets/footer/ui/ContactModal.vue'

const open = defineModel<boolean>('open', { default: false })

const { t, locale } = useI18n()
const router = useRouter()
const route = useRoute()
const modalStore = useModalStore()

const languageOptions = computed(() => [
  { value: 'ko', label: '🇰🇷 한국어' },
  { value: 'en', label: '🇺🇸 English' },
  { value: 'ja', label: '🇯🇵 日本語' },
])

const handleLocaleChange = (value: string | number) => {
  const next = value as Locale
  locale.value = next
  localStorage.setItem('lang', next)
  const newPath = `/${next}${route.fullPath.replace(/^\/(ko|en|ja)/, '')}`
  router.replace(newPath)
}

// 라우트가 바뀌면 자동으로 닫음
watch(
  () => route.fullPath,
  () => (open.value = false),
)

const close = () => (open.value = false)

const navigate = (name: string) => {
  router.push({ name })
  close()
}

const openContact = () => {
  close()
  modalStore.onOpen(ContactModal, {}, { transition: 'up', isBackgroundClose: true })
}
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer-fade">
      <div v-if="open" class="fixed inset-0 z-[110] bg-black/40 md:hidden" @click="close" />
    </Transition>
    <Transition name="drawer-slide">
      <aside
        v-if="open"
        class="fixed inset-y-0 right-0 z-[120] w-[80vw] max-w-[320px] bg-white shadow-2xl flex flex-col md:hidden"
        role="dialog"
        aria-label="메뉴"
      >
        <!-- 드로어 헤더 -->
        <div class="flex items-center justify-between px-5 h-14 border-b border-neutral-200">
          <span class="text-body-md font-bold">PUZMU</span>
          <ButtonIcon icon="close-icon" size="md" aria-label="닫기" @click="close" />
        </div>

        <!-- 상단: 메뉴 (문의하기는 nav 의 가장 하단으로 밀어냄) -->
        <nav class="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
          <button
            type="button"
            class="w-full text-left text-body-md font-medium px-3 py-3 rounded-lg cursor-pointer hover:bg-neutral-100 transition-colors"
            @click="navigate(RouteNames.TANGRAM_LIST)"
          >
            {{ t('header.tangram') }}
          </button>

          <button
            type="button"
            class="mt-auto w-full text-left text-body-md font-medium px-3 py-3 rounded-lg cursor-pointer hover:bg-neutral-100 transition-colors"
            @click="openContact"
          >
            {{ t('footer.creator.contact') }}
          </button>
        </nav>

        <!-- 하단: 다국어 + 문의 + (옵션) 로그아웃 -->
        <div class="border-t border-neutral-200 px-3 py-4 space-y-2">
          <div class="px-3">
            <SelectBox
              :model-value="locale"
              :options="languageOptions"
              @update:model-value="handleLocaleChange"
            />
          </div>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}
</style>
