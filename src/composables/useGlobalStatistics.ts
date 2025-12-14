import { statisticsService, type StatisticsData } from '@/services/statisticsService'

const globalStatisticsData = ref<StatisticsData | null>(null)
const isLoadingGlobal = ref(false)
const errorGlobal = ref<string | null>(null)

export const useGlobalStatistics = () => {
  const formattedGlobalData = computed(() => {
    if (!globalStatisticsData.value) {
      return {
        total_searches:       0,
        active_integrations:  0,
        total_integrations:   0,
        total_ioc_analyses:   0,
        analyses_by_provider: {},
        analyses_by_ioc_type: {}
      }
    }

    const {
      totalSearches,
      activeIntegrations,
      totalIntegrations,
      totalIOCAnalyses,
      analysesByProvider,
      analysesByType
    } = globalStatisticsData.value

    return {
      total_searches:       totalSearches,
      active_integrations:  activeIntegrations,
      total_integrations:   totalIntegrations,
      total_ioc_analyses:   totalIOCAnalyses || 0,
      analyses_by_provider: analysesByProvider || {},
      analyses_by_ioc_type: {
        domains: analysesByType?.domain || 0,
        ips:     analysesByType?.ip || 0,
        hashes:  analysesByType?.hash || 0
      }
    }
  })

  const hasGlobalStatistics = computed(() => {
    return globalStatisticsData.value !== null
  })

  const loadGlobalStatistics = async () => {
    try {
      isLoadingGlobal.value = true
      errorGlobal.value = null
      globalStatisticsData.value = await statisticsService.getGlobalStatistics()
    } catch (err) {
      errorGlobal.value = err instanceof Error ? err.message : 'Error loading global statistics'
      console.error('Error loading global statistics:', err)
    } finally {
      isLoadingGlobal.value = false
    }
  }

  return {
    globalStatisticsData,
    formattedGlobalData,
    hasGlobalStatistics,
    isLoadingGlobal,
    errorGlobal,
    loadGlobalStatistics
  }
}
