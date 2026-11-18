<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Header } from '@/widgets/header'
import { Footer } from '@/widgets/footer'
import { Toast, Modal } from '@/shared/ui'

const route = useRoute()
</script>

<template>
  <div class="flex flex-col w-full min-h-screen">
    <Header v-if="route.meta.header !== false" />
    <main id="main" class="flex-1 flex flex-col">
      <router-view></router-view>
    </main>
    <Footer v-if="route.meta.footer !== false" />
    <Modal />
    <Toast />
  </div>
</template>
