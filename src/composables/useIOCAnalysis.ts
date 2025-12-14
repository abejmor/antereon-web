import { useExport } from '@/composables/useExport'

import type { IOCAnalysisResult, IOCAnalysisStrategy } from '@/services/strategies/IOCAnalysisStrategy'

import { AVAILABLE_INTEGRATIONS } from '@/constants/integrations'
import { integrationsService } from '@/services/integrationsService'
import { iocAnalysisService } from '@/services/iocAnalysisService'

export const useIOCAnalysis = () => {
  const results = ref<Map<string, IOCAnalysisResult>>(new Map())
  const isAnalyzing = ref(false)
  const error = ref<string | null>(null)

  const detectIOCType = (ioc: string): 'ip' | 'domain' | 'hash' | 'url' | 'unknown' => {
    if (!ioc || typeof ioc !== 'string') return 'unknown'

    const trimmedIOC = ioc.trim()

    if (!trimmedIOC) return 'unknown'

    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/

    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i

    const domainRegex = /^(?!^\d+\.\d+\.\d+\.\d+$)[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

    const hashRegex = /^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$/

    if (ipRegex.test(trimmedIOC)) {
      return 'ip'
    } else if (urlRegex.test(trimmedIOC)) {
      return 'url'
    } else if (hashRegex.test(trimmedIOC)) {
      return 'hash'
    } else if (domainRegex.test(trimmedIOC)) {
      return 'domain'
    }

    return 'unknown'
  }

  const createAnalysisStrategy = async (integrationId: string, userIntegration: any): Promise<IOCAnalysisStrategy> => {
    const providerType = userIntegration.provider

    switch (providerType) {
      case 'abuseipdb':
        const { AbuseIPDBStrategy } = await import('@/services/strategies/AbuseIPDBStrategy')
        return new AbuseIPDBStrategy(integrationId)
      case 'virustotal':
        const { VirusTotalStrategy } = await import('@/services/strategies/VirusTotalStrategy')
        return new VirusTotalStrategy(integrationId)
      case 'alienvault':
        const { AlienVaultStrategy } = await import('@/services/strategies/AlienVaultStrategy')
        return new AlienVaultStrategy(integrationId)
      default:
        throw new Error(`ioc provider not supported: ${userIntegration.name}`)
    }
  }

  const executeAnalysis = async (strategy: IOCAnalysisStrategy, ioc: string, detectedType: 'ip' | 'domain' | 'hash' | 'url'): Promise<IOCAnalysisResult> => {
    switch (detectedType) {
      case 'ip':
        return await strategy.analyzeIP(ioc)
      case 'domain':
        return await strategy.analyzeDomain(ioc)
      case 'hash':
        return await strategy.analyzeHash(ioc)
      case 'url':
        return await strategy.analyzeUrl(ioc)
      default:
        throw new Error(`ioc type not supported: ${detectedType}`)
    }
  }

  const validateIOCAndProvider = async (ioc: string, integrationId: string, detectedType: 'ip' | 'domain' | 'hash' | 'url' | 'unknown', userIntegration: any) => {
    if (detectedType === 'unknown') {
      throw new Error('could not detect IOC type')
    }

    const availableIntegration = AVAILABLE_INTEGRATIONS.find(ai => ai.id === userIntegration.provider)

    if (!availableIntegration) {
      throw new Error(`integration not found for provider: ${userIntegration.name}`)
    }

    if (!availableIntegration.supportedIOCTypes.includes(detectedType)) {
      throw new Error(`IOC type '${detectedType}' is not supported by ${userIntegration.name}`)
    }

    return { integration: availableIntegration, validatedType: detectedType as 'ip' | 'domain' | 'hash' | 'url' }
  }

  const saveAnalysisResult = async (result: IOCAnalysisResult): Promise<string | undefined> => {
    try {
      const resultToSave = {
        iocValue:          result.iocValue,
        iocType:           result.iocType,
        provider:          result.provider,
        data:              result.data || {},
        analysisTimestamp: new Date().toISOString(),
        ...(result.error && { error: result.error })
      }

      const savedResult = await iocAnalysisService.create(resultToSave)
      return savedResult.id
    } catch (saveError) {
      console.warn('Error saving result to database:', saveError)
      return undefined
    }
  }

  const analyzeIOC = async (ioc: string, integrationId: string) => {
    isAnalyzing.value = true
    error.value = null

    try {
      const detectedType = detectIOCType(ioc)

      const userIntegration = await integrationsService.getById(integrationId)

      const { validatedType } = await validateIOCAndProvider(ioc, integrationId, detectedType, userIntegration)

      const strategy = await createAnalysisStrategy(integrationId, userIntegration)

      const result = await executeAnalysis(strategy, ioc, validatedType)

      results.value.set(`${integrationId}-${ioc}`, result)

      const savedId = await saveAnalysisResult(result)

      if (savedId) {
        results.value.set(`${integrationId}-${ioc}`, {
          ...result,
          id: savedId
        })
      }

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'unknown error'
      console.error('Analysis error:', err)
    } finally {
      isAnalyzing.value = false
    }
  }

  const getResultsForIOC = (ioc: string) => {
    return Array.from(results.value.entries())
      .filter(([key]) => key.endsWith(`-${ioc}`))
      .map(([, result]) => result)
  }

  const clearResults = () => {
    results.value.clear()
    error.value = null
  }

  const clearError = () => {
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

  const exportResults = (provider?: string) => {
    const resultsToExport = provider
      ? Array.from(results.value.values()).filter(r => r.provider === provider)
      : Array.from(results.value.values())

    if (resultsToExport.length === 0) {
      console.warn('no results to export')
      return
    }

    const { exportIOCResults } = useExport()
    const filename = provider
      ? `ioc-analysis-${provider}-${new Date().toISOString().split('T')[0]}.csv`
      : `ioc-analysis-${new Date().toISOString().split('T')[0]}.csv`

    exportIOCResults(resultsToExport, filename)
  }

  const allResults = computed(() => Array.from(results.value.values()))
  const hasResults = computed(() => results.value.size > 0)
  const isLoading = computed(() => isAnalyzing.value)
  const resultsArray = computed(() => Array.from(results.value.values()))

  return {
    results:          allResults,
    resultsArray,
    isAnalyzing,
    isLoading,
    error,
    hasResults,
    analyzeIOC,
    detectIOCType,
    getResultsForIOC,
    clearResults,
    clearError,
    removeResult,
    exportResults,
    _internalResults: results
  }
}
