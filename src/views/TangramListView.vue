<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { LanguageSwitcher } from '@/components/ui'
import { Card } from '@/components/tangram'
import type { Tangram } from '@/types'

const { t } = useI18n()

const items: Tangram[] = [
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
  {
    id: 1,
    title: 'asdf',
    thumbnail:
      'https://images.unsplash.com/photo-1503264116251-35a269479413?crop=entropy&cs=srgb&fm=jpg&ixid=M3wzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NDg2MjI1NDR8&ixlib=rb-4.1.0&q=85',
  },
]
</script>

<template>
  <div class="w-full h-full min-h-screen bg-indigo-100">
    <div class="relative flex flex-col items-center w-full">
      <div class="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <h1 class="font-bold text-4xl py-4">{{ t('tangram.title') }}</h1>

      <main
        class="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-12 max-w-[1280px] gap-2"
      >
        <template v-for="(item, index) of items" :key="index">
          <Card :item="item" />
        </template>
      </main>

      <footer class="mt-24"></footer>
    </div>
  </div>
</template>
