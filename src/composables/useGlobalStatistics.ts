import { statisticsService, type StatisticsData } from '@/services/statisticsService'

export const useGlobalStatistics = () => {
  const globalStatisticsData = ref<StatisticsData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const hasStatistics = computed(() => globalStatisticsData.value !== null)

  const loadGlobalStatistics = async () => {
    try {
      isLoading.value = true
      error.value = null
      globalStatisticsData.value = await statisticsService.getGlobalStatistics()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error loading global statistics'
      console.error('Error loading global statistics:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    globalStatisticsData,
    hasStatistics,
    isLoading,
    error,
    loadGlobalStatistics
  }
}
