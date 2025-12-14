import type { Integration } from '@/types/integration'

import { AVAILABLE_INTEGRATIONS } from '@/constants/integrations'
import { integrationsService } from '@/services/integrationsService'

export interface SelectOption {
  id: string
  value: string
  label: string
}

export interface IntegrationsListFilters {
  search: string
  provider: string[]
  status: string[]
}

export interface IntegrationsListFiltersToSend {
  search?: string
  provider?: string[]
  isActive?: string[]
}

export interface IntegrationsState {
  integrationsList: Integration[]
  integrationsFilters: IntegrationsListFilters
  loading: boolean
}

export const useIntegrationsStore = defineStore('integrations', {

  state: (): IntegrationsState => ({
    integrationsList:    [],
    integrationsFilters: {
      search:   '',
      provider: [],
      status:   []
    },
    loading: false
  }),
  getters: {
    getFiltersToSend(): IntegrationsListFiltersToSend {
      const filtersToSend: IntegrationsListFiltersToSend = {}

      if (this.integrationsFilters.provider.length > 0) {
        filtersToSend.provider = this.integrationsFilters.provider
      }

      if (this.integrationsFilters.status.length > 0) {
        filtersToSend.isActive = this.integrationsFilters.status
      }

      if (this.integrationsFilters.search !== '') {
        filtersToSend.search = this.integrationsFilters.search
      }

      return filtersToSend
    },
    activeIntegrations(): Integration[] {
      return this.integrationsList.filter((integration: Integration) => integration.isActive)
    },
    inactiveIntegrations(): Integration[] {
      return this.integrationsList.filter((integration: Integration) => !integration.isActive)
    },
    providerOptions(): SelectOption[] {
      return AVAILABLE_INTEGRATIONS.map(provider => ({
        id:    provider.id,
        value: provider.id,
        label: provider.name
      }))
    },
    statusOptions(): SelectOption[] {
      return [
        { id: 'active', value: 'active', label: 'Active' },
        { id: 'inactive', value: 'inactive', label: 'Inactive' }
      ]
    }
  },
  actions: {
    setFilters<K extends keyof IntegrationsListFilters>(key: K, value: IntegrationsListFilters[K]) {
      this.integrationsFilters[key] = value
    },
    setLoading(loading: boolean) {
      this.loading = loading
    },
    async getIntegrationsList() {
      try {
        this.setLoading(true)
        const integrationsList = await integrationsService.getAll(this.getFiltersToSend)
        this.integrationsList = integrationsList
      } catch (error) {
        console.error('Error loading integrations:', error)
        throw error
      } finally {
        this.setLoading(false)
      }
    },
    async updateIntegrationStatus(id: string) {
      try {
        await integrationsService.toggleStatus(id)
        await this.getIntegrationsList()
      } catch (error) {
        console.error('Error updating integration status:', error)
        throw error
      }
    },
    async createIntegration(integrationData: any) {
      try {
        const newIntegration = await integrationsService.create(integrationData)
        await this.getIntegrationsList()
        return newIntegration
      } catch (error) {
        console.error('Error creating integration:', error)
        throw error
      }
    },
    async updateIntegration(id: string, integrationData: any) {
      try {
        const updatedIntegration = await integrationsService.update(id, integrationData)
        await this.getIntegrationsList()
        return updatedIntegration
      } catch (error) {
        console.error('Error updating integration:', error)
        throw error
      }
    },
    async deleteIntegration(id: string) {
      try {
        await integrationsService.delete(id)
        await this.getIntegrationsList()
      } catch (error) {
        console.error('Error deleting integration:', error)
        throw error
      }
    }
  }
})
