import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { DEFAULT_THEME_ID, THEMES, type Theme, type ThemeId } from '../config/themes'

const STORAGE_KEY = 'theme'

const readStoredThemeId = (): ThemeId => {
  const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null
  return THEMES.some((t) => t.id === saved) ? (saved as ThemeId) : DEFAULT_THEME_ID
}

const applyThemeAttribute = (id: ThemeId) => {
  document.documentElement.setAttribute('data-theme', id)
}

export const useThemeStore = defineStore('theme', () => {
  const themeId = ref<ThemeId>(readStoredThemeId())
  const current = computed<Theme>(() => THEMES.find((t) => t.id === themeId.value) ?? THEMES[0])

  const setTheme = (id: ThemeId) => {
    if (!THEMES.some((t) => t.id === id)) return
    themeId.value = id
    localStorage.setItem(STORAGE_KEY, id)
    applyThemeAttribute(id)
  }

  const initialize = () => {
    applyThemeAttribute(themeId.value)
  }

  return { themeId, current, themes: THEMES, setTheme, initialize }
})
