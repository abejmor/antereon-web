import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { useIntegrationsStore } from '@/stores/integrations'

import { integrationsService } from '@/services/integrationsService'

vi.mock('@/services/integrationsService', () => ({
  integrationsService: { getAll: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), toggleStatus: vi.fn() }
}))
vi.mock('@/constants/integrations', () => ({
  AVAILABLE_INTEGRATIONS: [{ id: 'virustotal', name: 'VirusTotal' }]
}))

describe('integrations store', () => {
  beforeEach(() => {
    setActivePinia(createPinia()); vi.clearAllMocks()
  })

  it('initializes correctly', () => {
    const store = useIntegrationsStore()
    expect(store.integrationsList).toEqual([])
    expect(store.loading).toBe(false)
  })

  it('manages filters (set & get)', () => {
    const store = useIntegrationsStore()
    store.setFilters('search', 'test')
    store.setFilters('provider', ['virustotal'])

    expect(store.integrationsFilters.search).toBe('test')
    expect(store.getFiltersToSend).toEqual({ search: 'test', provider: ['virustotal'] })
  })

  it('computes active/inactive integrations', () => {
    const store = useIntegrationsStore()
    store.integrationsList = [
      { id: '1', isActive: true }, { id: '2', isActive: false }
    ] as any

    expect(store.activeIntegrations).toHaveLength(1)
    expect(store.inactiveIntegrations).toHaveLength(1)
  })

  it('provides options for UI', () => {
    const store = useIntegrationsStore()
    expect(store.providerOptions).toHaveLength(1)
    expect(store.statusOptions).toHaveLength(2)
  })

  it('loads integrations list (success & error)', async () => {
    const store = useIntegrationsStore()
    const mockList = [{ id: '1', name: 'Int 1' }]
    vi.mocked(integrationsService.getAll).mockResolvedValue(mockList as any)

    await store.getIntegrationsList()
    expect(store.integrationsList).toEqual(mockList)
    expect(store.loading).toBe(false)

    // Silence expected error log
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(integrationsService.getAll).mockRejectedValue(new Error('Fail'))
    await expect(store.getIntegrationsList()).rejects.toThrow()
    expect(store.loading).toBe(false)
    spy.mockRestore()
  })

  it('toggles loading state', () => {
    const store = useIntegrationsStore()
    store.setLoading(true); expect(store.loading).toBe(true)
    store.setLoading(false); expect(store.loading).toBe(false)
  })
})
