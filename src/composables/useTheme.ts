import { useTheme as useVuetifyTheme } from 'vuetify'

import { useAuthStore } from '@/stores/authStore'

import { profileService } from '@/services/profileService'

const currentTheme = ref<string>('antereonDark')

export const useTheme = () => {
  const vuetifyTheme = useVuetifyTheme()

  const availableThemes = [
    {
      key:  'antereonDark',
      name: 'Dark Theme',
      icon: 'mdi-weather-night'
    },
    {
      key:  'antereonLight',
      name: 'Light Theme',
      icon: 'mdi-weather-sunny'
    }
  ]

  const isDark = computed(() => {
    return currentTheme.value === 'antereonDark'
  })

  const setTheme = async (themeName: string) => {
    if (availableThemes.some((theme) => theme.key === themeName)) {
      currentTheme.value = themeName
      vuetifyTheme.global.name.value = themeName

      localStorage.setItem('antereon-theme', themeName)

      const authStore = useAuthStore()
      if (authStore.isAuthenticated) {
        try {
          const updatedUser = await profileService.updateProfile({ theme: themeName })
          authStore.user = updatedUser
        } catch (error) {
          console.error('Error updating theme in backend:', error)
        }
      }
    }
  }

  const toggleTheme = () => {
    const newTheme = isDark.value ? 'antereonLight' : 'antereonDark'
    setTheme(newTheme)
  }

  const initializeTheme = () => {
    let savedTheme = 'antereonDark'

    const authStore = useAuthStore()
    if (authStore.isAuthenticated && authStore.user?.theme) {
      savedTheme = authStore.user.theme
    } else {
      const localTheme = localStorage.getItem('antereon-theme')
      if (localTheme && availableThemes.some((theme) => theme.key === localTheme)) {
        savedTheme = localTheme
      }
    }

    currentTheme.value = savedTheme
    vuetifyTheme.global.name.value = savedTheme
  }

  const resetToDefaultTheme = () => {
    currentTheme.value = 'antereonDark'
    vuetifyTheme.global.name.value = 'antereonDark'
  }

  const getCurrentTheme = () => {
    return availableThemes.find((theme) => theme.key === currentTheme.value)
  }

  return {
    currentTheme: readonly(currentTheme),
    availableThemes,
    isDark,
    setTheme,
    toggleTheme,
    initializeTheme,
    resetToDefaultTheme,
    getCurrentTheme
  }
}
