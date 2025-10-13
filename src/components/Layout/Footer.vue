<script setup lang="ts">
import { TangramIcon } from '@/assets/icon/home'
import { RouteNames } from '@/router/router-name'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <footer className="border-t border-border py-12 px-4 bg-muted/30">
    <div className="container max-w-6xl mx-auto">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white"
            >
              <TangramIcon />
            </div>
            <span className="text-lg">Puzmu</span>
          </div>
          <p className="text-neutral-500 text-sm">
            {{ t('footer.description') }}
          </p>
        </div>

        <div>
          <h4 className="mb-4">{{ t('footer.games.title') }}</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li>
              <router-link
                :to="{ name: RouteNames.TANGRAM_LIST }"
                class="text-neutral-400 hover:text-neutral-900 [&.router-link-active]:text-neutral-900"
              >
                {{ t('footer.games.tangram') }}
              </router-link>
            </li>
            <li>
              <router-link to="#" class="text-neutral-400 hover:text-neutral-900">
                {{ t('footer.games.polyomino') }}
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4">{{ t('footer.creator.title') }}</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li>
              <router-link to="#" class="text-neutral-400 hover:text-neutral-900">
                {{ t('footer.creator.about') }}
              </router-link>
            </li>
            <li>
              <router-link to="#" class="text-neutral-400 hover:text-neutral-900">
                {{ t('footer.creator.contact') }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-8 text-center text-sm text-neutral-500">
        <p>&copy; 2025 Puzmu. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>
