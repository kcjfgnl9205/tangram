<script setup lang="ts">
import { RouteNames } from '@/app/router/router-name'
import { useI18n } from 'vue-i18n'
import { useModalStore } from '@/shared/stores/modal.store'
import ContactModal from './ContactModal.vue'
import { Icon } from '@/shared/ui'

const { t } = useI18n()
const modalStore = useModalStore()

const openContact = () => {
  modalStore.onOpen(ContactModal, {}, { transition: 'up', isBackgroundClose: true })
}
</script>

<template>
  <footer class="border-t border-border py-10 px-4 bg-muted/30">
    <div class="max-w-[1400px] mx-auto flex flex-col gap-8">
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <!-- 로고 + 설명 -->
        <div class="md:max-w-md">
          <div class="flex items-center gap-2 mb-3">
            <Icon icon="logo-icon" class="w-6 h-6" />
            <span class="text-body-lg font-semibold">Puzmu</span>
          </div>
          <p class="text-neutral-500 text-body-sm">{{ t('footer.description') }}</p>
        </div>

        <!-- 링크 -->
        <nav class="flex items-center gap-6 text-body-sm text-neutral-500">
          <router-link
            :to="{ name: RouteNames.TANGRAM_LIST }"
            class="hover:text-neutral-900 [&.router-link-active]:text-neutral-900"
          >
            {{ t('footer.games.tangram') }}
          </router-link>
          <button type="button" class="hover:text-neutral-900 cursor-pointer" @click="openContact">
            {{ t('footer.creator.contact') }}
          </button>
        </nav>
      </div>

      <div class="pt-6 text-center text-body-sm text-neutral-500">
        &copy; 2025 Puzmu. All rights reserved.
      </div>
    </div>
  </footer>
</template>
