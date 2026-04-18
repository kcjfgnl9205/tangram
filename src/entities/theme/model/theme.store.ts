import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { DEFAULT_THEME_ID, THEMES, type Theme, type ThemeId } from '../config/themes'

const STORAGE_KEY = 'theme'

const readStoredThemeId = (): ThemeId => {
  const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null
  return THEMES.some((t) => t.id === saved) ? (saved as ThemeId) : DEFAULT_THEME_ID
}

const applyThemeAttribute = (id: ThemeId, theme: Theme) => {
  const root = document.documentElement
  root.setAttribute('data-theme', id)
  root.style.setProperty('--theme-bg', theme.bg)
  root.style.setProperty('--theme-board', theme.board)
  root.style.setProperty('--theme-border', theme.border)
  root.style.setProperty('--theme-outline', theme.outline)
  for (const [key, color] of Object.entries(theme.tangram)) {
    root.style.setProperty(`--theme-${key}`, color)
  }
}

export const useThemeStore = defineStore('theme', () => {
  const themeId = ref<ThemeId>(readStoredThemeId())
  const current = computed<Theme>(() => THEMES.find((t) => t.id === themeId.value) ?? THEMES[0])

  const setTheme = (id: ThemeId) => {
    const next = THEMES.find((t) => t.id === id)
    if (!next) return
    themeId.value = id
    localStorage.setItem(STORAGE_KEY, id)
    applyThemeAttribute(id, next)
  }

  const initialize = () => {
    applyThemeAttribute(themeId.value, current.value)
  }

  const fillOf = (tangramType: keyof Theme['tangram']) => current.value.tangram[tangramType]

  return { themeId, current, themes: THEMES, setTheme, initialize, fillOf }
})
