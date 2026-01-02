import { useExport } from '@/composables/useExport'

import type { IOCAnalysisResult, IOCAnalysisStrategy } from '@/types/strategies/IOCAnalysisStrategy'

import { detectIOCType } from '@/helpers/iocHelpers'
import { integrationsService } from '@/services/integrationsService'
import { iocAnalysisService } from '@/services/iocAnalysisService'

export const useIOCAnalysis = () => {
  const results = ref<Map<string, IOCAnalysisResult>>(new Map())
  const isAnalyzing = ref(false)
  const error = ref<string | null>(null)

  const analyzeIOC = async (ioc: string, integrationId: string) => {
    isAnalyzing.value = true
    error.value = null

    try {
      const detectedType = detectIOCType(ioc)
      if (detectedType === 'unknown') throw new Error('Invalid IOC type')

      const userIntegration = await integrationsService.getById(integrationId)

      let result: IOCAnalysisResult
      switch (userIntegration.provider) {
        case 'abuseipdb':
          const { AbuseIPDBStrategy } = await import('@/services/strategies/AbuseIPDBStrategy')
          const abuseStrategy = new AbuseIPDBStrategy(integrationId)
          result = await abuseStrategy.analyzeIP(ioc)
          break
        case 'virustotal':
          const { VirusTotalStrategy } = await import('@/services/strategies/VirusTotalStrategy')
          const virusStrategy = new VirusTotalStrategy(integrationId)
          switch (detectedType) {
            case 'ip':
              result = await virusStrategy.analyzeIP(ioc)
              break
            case 'domain':
              result = await virusStrategy.analyzeDomain(ioc)
              break
            case 'hash':
              result = await virusStrategy.analyzeHash(ioc)
              break
            case 'url':
              result = await virusStrategy.analyzeUrl(ioc)
              break
          }
          break
        case 'alienvault':
          const { AlienVaultStrategy } = await import('@/services/strategies/AlienVaultStrategy')
          const alienStrategy = new AlienVaultStrategy(integrationId)
          switch (detectedType) {
            case 'ip':
              result = await alienStrategy.analyzeIP(ioc)
              break
            case 'domain':
              result = await alienStrategy.analyzeDomain(ioc)
              break
            case 'hash':
              result = await alienStrategy.analyzeHash(ioc)
              break
            case 'url':
              result = await alienStrategy.analyzeUrl(ioc)
              break
          }
          break
        default:
          throw new Error(`Provider not supported: ${userIntegration.provider}`)
      }

      results.value.set(`${integrationId}-${ioc}`, result)

      const analysisTimestamp = new Date().toISOString()
      const savedResult = await iocAnalysisService.create({
        iocValue: result.iocValue,
        iocType:  result.iocType,
        provider: result.provider,
        data:     result.data || {},
        analysisTimestamp,
        ...(result.error && { error: result.error })
      })
      results.value.set(`${integrationId}-${ioc}`, {
        ...result,
        id: savedResult.id,
        analysisTimestamp
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Analysis failed'
      console.error('Analysis error:', err)
    } finally {
      isAnalyzing.value = false
    }
  }

  const clearResults = () => {
    results.value.clear()
    error.value = null
  }

  const removeResult = (resultId: string) => {
    for (const [key, result] of results.value.entries()) {
      if (result.id === resultId) {
        results.value.delete(key)
        break
      }
    }
  }

  const resultsArray = computed(() => Array.from(results.value.values()))
  const hasResults = computed(() => results.value.size > 0)

  const exportResults = (provider?: string) => {
    const { exportIOCResults } = useExport()
    const resultsToExport = provider
      ? resultsArray.value.filter((r) => r.provider === provider)
      : resultsArray.value

    if (resultsToExport.length === 0) return

    const filename = provider
      ? `ioc-analysis-${provider}-${new Date().toISOString().split('T')[0]}.csv`
      : `ioc-analysis-${new Date().toISOString().split('T')[0]}.csv`

    exportIOCResults(resultsToExport, filename)
  }

  const getResultsForIOC = (ioc: string) => {
    return Array.from(results.value.entries())
      .filter(([key]) => key.endsWith(`-${ioc}`))
      .map(([, result]) => result)
  }

  return {
    results:          resultsArray,
    isAnalyzing,
    error,
    hasResults,
    analyzeIOC,
    detectIOCType,
    getResultsForIOC,
    clearResults,
    removeResult,
    exportResults,
    _internalResults: results
  }
}
