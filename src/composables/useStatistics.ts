import { ref, computed } from 'vue'

import { formatProviderName } from '@/constants/integrations'
import { statisticsService, type StatisticsSummary } from '@/services/statisticsService'

export const useStatistics = () => {
  const loading = ref(false)
  const summaryData = ref<StatisticsSummary | null>(null)

  const loadSummaryStatistics = async () => {
    try {
      loading.value = true
      summaryData.value = await statisticsService.getSummary()
    } catch (err) {
      console.error('Error loading summary statistics:', err)
    } finally {
      loading.value = false
    }
  }

  const formattedSummary = computed(() => {
    if (!summaryData.value) return null
    return [
      { label: 'home.statistics.total_searches', value: summaryData.value?.totalSearches?.toLocaleString() || '0' },
      { label: 'home.statistics.active_integrations', value: summaryData.value?.activeIntegrations?.toLocaleString() || '0' },
      { label: 'home.statistics.total_integrations', value: summaryData.value?.totalIntegrations?.toLocaleString() || '0' },
      { label: 'home.statistics.top_provider', value: summaryData.value?.topProviders?.[0]?.provider ? formatProviderName(summaryData.value.topProviders[0].provider) : 'N/A' }
    ]
  })

  return {
    loading,
    summaryData,
    formattedSummary,
    loadSummaryStatistics
  }
}
