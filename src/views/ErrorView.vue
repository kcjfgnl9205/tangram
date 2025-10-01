<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { RouteNames } from '@/router'
import { Button } from '@/components/ui'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const handleClick = () => {
  router.push({ name: RouteNames.TANGRAM_LIST })
}
</script>

<template>
  <main class="grid min-h-full place-items-center bg-white-900 px-6 py-24 sm:py-32 lg:px-8 flex-1">
    <div class="text-center">
      <p class="text-base font-semibold text-indigo-400">{{ route.query.code ?? 500 }}</p>
      <h1
        class="mt-4 text-5xl font-semibold tracking-tight text-balance text-indigo-500 sm:text-7xl"
      >
        {{ route.query.message }}
      </h1>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <Button variant="btn-blue" @click="handleClick">
          {{ t('error.button') }}
        </Button>
      </div>
    </div>
  </main>
</template>
