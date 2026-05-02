<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { RouteNames } from '@/app/router/router-name'
import { Button } from '@/shared/ui'

const { t } = useI18n()
const router = useRouter()
const handleClick = () => {
  router.push({ name: RouteNames.TANGRAM_LIST })
}
</script>

<template>
  <div class="grid min-h-full place-items-center bg-white-900 px-6 py-24 sm:py-32 lg:px-8 flex-1">
    <div class="text-center">
      <p class="text-body-md font-semibold text-indigo-400">404</p>
      <h1
        class="mt-4 text-display-lg tracking-tight text-balance text-indigo-500 sm:text-display-xl"
      >
        {{ t('notFound.title') }}
      </h1>
      <p class="mt-6 text-body-lg font-medium text-pretty text-gray-400 sm:text-heading-sm">
        {{ t('notFound.subTitle') }}
      </p>
      <div class="mt-10 flex items-center justify-center gap-x-6">
        <Button variant="btn-blue" @click="handleClick">
          {{ t('notFound.button') }}
        </Button>
      </div>
    </div>
  </div>
</template>
