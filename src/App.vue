<script setup lang="ts">
import { Header, Footer } from '@/components/Layout'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="flex flex-col w-full min-h-screen">
    <Header v-if="route.meta.header !== false" />
    <router-view></router-view>
    <Footer v-if="route.meta.footer !== false" />
  </div>
</template>
