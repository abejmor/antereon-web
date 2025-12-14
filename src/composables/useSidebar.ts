import { useDisplay } from 'vuetify'

const sidebarOpen = ref(true)

export const useSidebar = () => {
  const { mobile } = useDisplay()

  const isMobile = computed(() => mobile.value)

  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  watch(isMobile, (newIsMobile) => {
    if (newIsMobile) {
      sidebarOpen.value = false
    } else {
      sidebarOpen.value = true
    }
  }, { immediate: true })

  return {
    sidebarOpen,
    isMobile,
    toggleSidebar
  }
}
