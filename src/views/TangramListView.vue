<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTangramStore } from '@/stores'
import { Card } from '@/components/tangram'

const tangramStore = useTangramStore()
const { items } = storeToRefs(tangramStore)
</script>

<template>
  <div class="w-full h-full min-h-screen">
    <div class="relative flex flex-col items-center w-full">
      <main
        class="w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-12 max-w-[1280px] gap-2 p-2 md:p-4"
      >
        <template v-for="(item, index) of items" :key="index">
          <Card :item="item" />
        </template>
      </main>

      <footer class="mt-24"></footer>
    </div>
  </div>
</template>
