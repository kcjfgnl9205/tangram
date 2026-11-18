import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useDropdownStore = defineStore('v2_dropdown', () => {
  const openId = ref<string | null>(null)

  const open = (id: string) => {
    openId.value = id
  }

  const close = () => {
    openId.value = null
  }

  const toggle = (id: string) => {
    openId.value = openId.value === id ? null : id
  }

  return { openId, open, close, toggle }
})
