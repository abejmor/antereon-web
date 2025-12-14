import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { useIOCAnalysis } from '@/composables/useIOCAnalysis'

const mocks = vi.hoisted(() => ({
  integrations: { getById: vi.fn() },
  analysis: { create: vi.fn() },
  export: { exportIOCResults: vi.fn(), exportIOCResultsByProvider: vi.fn() },
  strategy: { analyzeIP: vi.fn() },
}))

vi.mock('@/services/integrationsService', () => ({ integrationsService: mocks.integrations }))
vi.mock('@/services/iocAnalysisService', () => ({ iocAnalysisService: mocks.analysis }))
vi.mock('@/composables/useExport', () => ({ useExport: () => mocks.export }))
vi.mock('@/services/strategies/VirusTotalStrategy', () => ({
  VirusTotalStrategy: vi.fn(() => mocks.strategy),
}))

describe('useIOCAnalysis', () => {
  let composable: ReturnType<typeof useIOCAnalysis>

  beforeEach(() => {
    composable = useIOCAnalysis()
    vi.clearAllMocks()
  })
  afterEach(() => composable.clearResults())

  it('initializes and manages state correctly', () => {
    expect(composable.results.value).toEqual([])
    expect(composable.isAnalyzing.value).toBe(false)
    expect(composable.error.value).toBeNull()
  })

  describe('analyzeIOC', () => {
    const mockIntegration = { id: '1', provider: 'virustotal', isActive: true }
    const mockResult = { iocValue: '8.8.8.8', iocType: 'ip', provider: 'virustotal', data: {} }

    it('analyzes IP successfully', async () => {
      mocks.integrations.getById.mockResolvedValue(mockIntegration)
      mocks.strategy.analyzeIP.mockResolvedValue(mockResult)
      mocks.analysis.create.mockResolvedValue({ id: 'saved-id' })

      await composable.analyzeIOC('8.8.8.8', '1')

      expect(composable.isAnalyzing.value).toBe(false)
      expect(composable.hasResults.value).toBe(true)
      expect(composable.results.value).toHaveLength(1)
    })

    it('handles errors gracefully', async () => {
      mocks.integrations.getById.mockRejectedValue(new Error('Fail'))

      const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
      await composable.analyzeIOC('8.8.8.8', '1')
      expect(composable.error.value).toBe('Fail')
      expect(composable.hasResults.value).toBe(false)
      spy.mockRestore()
    })
  })

  describe('result management', () => {
    it('manages results (add, get, remove, clear)', () => {
      const result = {
        id: 'res-1',
        iocValue: '8.8.8.8',
        iocType: 'ip',
        provider: 'virustotal',
        data: {},
      }
      composable._internalResults.value.set('integration-8.8.8.8', result as any)

      expect(composable.hasResults.value).toBe(true)
      expect(composable.getResultsForIOC('8.8.8.8')).toHaveLength(1)

      composable.removeResult('res-1')
      expect(composable.hasResults.value).toBe(false)

      composable._internalResults.value.set('integration-8.8.8.8', result as any)
      composable.clearResults()
      expect(composable.hasResults.value).toBe(false)
    })
  })

  it('exports results correctly', async () => {
    composable._internalResults.value.set('k', { iocValue: '8.8.8.8', provider: 'vt' } as any)
    composable.exportResults()
    expect(mocks.export.exportIOCResults).toHaveBeenCalled()

    composable.exportResults('vt')
    expect(mocks.export.exportIOCResults).toHaveBeenCalled()
  })
})
