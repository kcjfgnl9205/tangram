import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Tangram } from '@/types'

export const useTangramStore = defineStore('tangram', () => {
  const items = ref<Tangram[]>([])
  const init = async () => {
    const res = await fetch('https://cdn.playtangram.com/data/index.json')
    items.value = await res.json()
  }
  return { items, init }
})
