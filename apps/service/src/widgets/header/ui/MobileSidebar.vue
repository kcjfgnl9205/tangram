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

const openContact = () => {
  close()
  modalStore.onOpen(ContactModal, {}, { transition: 'up', isBackgroundClose: true })
}
</script>

<template>
  <Teleport to="body">
    <Transition enter-active-class="animate-fade-in" leave-active-class="animate-fade-out">
      <div v-if="open" class="fixed inset-0 z-[110] bg-black/40 md:hidden" @click="close" />
    </Transition>
    <Transition
      enter-active-class="animate-drawer-in-right"
      leave-active-class="animate-drawer-out-right"
    >
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

        <!-- 데스크톱 헤더와 같은 구성 (문의하기는 nav 의 가장 하단으로 밀어냄) -->
        <nav class="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
          <router-link
            :to="{ name: RouteNames.TANGRAM_LIST }"
            class="w-full text-body-md px-3 py-3 rounded-lg cursor-pointer hover:bg-neutral-100 transition-colors text-ink-3 [&.router-link-active]:text-ink [&.router-link-active]:font-bold [&.router-link-active]:bg-neutral-100"
          >
            {{ t('header.nav.puzzles') }}
          </router-link>
          <router-link
            :to="{ name: RouteNames.SHOP }"
            class="w-full text-body-md px-3 py-3 rounded-lg cursor-pointer hover:bg-neutral-100 transition-colors text-ink-3 [&.router-link-active]:text-ink [&.router-link-active]:font-bold [&.router-link-active]:bg-neutral-100"
          >
            {{ t('header.nav.shop') }}
          </router-link>

          <button
            type="button"
            class="mt-auto w-full text-left text-body-md font-medium px-3 py-3 rounded-lg cursor-pointer hover:bg-neutral-100 transition-colors"
            @click="openContact"
          >
            {{ t('footer.creator.contact') }}
          </button>
        </nav>

        <!-- 하단: 다국어 + 문의 + (옵션) 로그아웃 -->
        <div class="border-t border-neutral-200 px-3 py-4 space-y-3">
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
