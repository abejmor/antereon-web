import { Service } from './service'

import type { Integration, CreateIntegrationRequest, UpdateIntegrationRequest } from '@/types/integration'

export type { Integration, CreateIntegrationRequest, UpdateIntegrationRequest }

class IntegrationsService extends Service {
  get baseUrl() {
    return 'api/integrations'
  }

  async getAll(params?: any): Promise<Integration[]> {
    return this.axiosInstance.get(this.baseUrl, {
      params,
      paramsSerializer: {
        indexes: null
      }
    }).then(response => response.data)
  }

  async toggleStatus(id: string): Promise<Integration> {
    return this.axiosInstance.put(`${this.baseUrl}/${id}/toggle`).then(response => response.data)
  }

  async create(data: CreateIntegrationRequest): Promise<Integration> {
    return this.axiosInstance.post(this.baseUrl, data).then(response => response.data)
  }

  async update(id: string, data: UpdateIntegrationRequest): Promise<Integration> {
    return this.axiosInstance.put(`${this.baseUrl}/${id}`, data).then(response => response.data)
  }

  async delete(id: string): Promise<void> {
    return this.axiosInstance.delete(`${this.baseUrl}/${id}`).then(response => response.data)
  }

  async updateApiKey(id: string, apiKey: string): Promise<Integration> {
    return this.axiosInstance.patch(`${this.baseUrl}/${id}/api-key`, { apiKey }).then(response => response.data)
  }

  async getDecryptedApiKey(id: string): Promise<{ apiKey: string; integrationId: string; provider: string }> {
    return this.axiosInstance.get(`${this.baseUrl}/${id}/decrypted-api-key`).then(response => response.data)
  }

  async getById(id: string): Promise<Integration> {
    return this.axiosInstance.get(`${this.baseUrl}/${id}`).then(response => response.data)
  }
}

export const integrationsService = new IntegrationsService()
