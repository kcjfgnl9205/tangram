<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui'
import { RouteNames } from '@/router/router-name'

const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <div class="container p-6 w-full mx-auto flex-1 flex flex-col gap-4">
    <div class="flex flex-col gap-6 rounded-xl border p-6">
      <div class="space-y-2">
        <h2 class="text-lg text-neutral-900 font-semibold leading-none">
          {{ t('home.tangram.title') }}
        </h2>
        <p class="text-neutral-500">
          {{ t('home.tangram.description') }}
        </p>
      </div>

      <div>
        <div className="space-y-4">
          <div>
            <h3 class="text-lg text-neutral-900">{{ t('home.tangram.HowToPlay.title') }}</h3>
            <ul
              className="list-disc list-inside space-y-2 text-muted-foreground mt-2 text-neutral-500"
            >
              <li>{{ t('home.tangram.HowToPlay.description1') }}</li>
              <li>{{ t('home.tangram.HowToPlay.description2') }}</li>
              <li>{{ t('home.tangram.HowToPlay.description3') }}</li>
              <li>{{ t('home.tangram.HowToPlay.description4') }}</li>
            </ul>
          </div>
        </div>
      </div>

      <Button variant="btn-blue" @click="() => router.push({ name: RouteNames.TANGRAM_LIST })">
        {{ t('home.tangram.button.playGame') }}
      </Button>
    </div>

    <div class="flex flex-col gap-6 rounded-xl border p-6">
      <div class="space-y-2">
        <h2 class="text-lg text-neutral-900 font-semibold leading-none">
          {{ t('home.polyomino.title') }}
        </h2>
        <p class="text-neutral-500">
          {{ t('home.polyomino.description') }}
        </p>
      </div>

      <div>
        <div className="space-y-4">
          <div>
            <h3 class="text-lg text-neutral-900">{{ t('home.polyomino.HowToPlay.title') }}</h3>
            <ul
              className="list-disc list-inside space-y-2 text-muted-foreground mt-2 text-neutral-500"
            >
              <li>{{ t('home.polyomino.HowToPlay.description1') }}</li>
              <li>{{ t('home.polyomino.HowToPlay.description2') }}</li>
              <li>{{ t('home.polyomino.HowToPlay.description3') }}</li>
              <li>{{ t('home.polyomino.HowToPlay.description4') }}</li>
            </ul>
          </div>
        </div>
      </div>
      <!-- <Button>{{ t('home.tangram.button.playGame') }}</Button> -->
    </div>
  </div>
</template>
