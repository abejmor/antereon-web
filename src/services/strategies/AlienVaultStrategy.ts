import type { IOCAnalysisStrategy, IOCAnalysisResult } from '@/types/strategies/IOCAnalysisStrategy'

import { Service } from '@/services/service'

export class AlienVaultStrategy implements IOCAnalysisStrategy {
  readonly provider = 'alienvault'
  private service = new Service()
  private integrationId: string

  constructor(integrationId: string) {
    this.integrationId = integrationId
  }

  async analyzeIP(ip: string): Promise<IOCAnalysisResult> {
    try {
      const response = await this.service.axiosInstance.post(
        '/api/alienvault/check-ip',
        { ip, integrationId: this.integrationId }
      )
      return this.transformResponse(response.data, ip, 'ip')
    } catch (error) {
      return this.createErrorResult(ip, 'ip', error)
    }
  }

  async analyzeDomain(domain: string): Promise<IOCAnalysisResult> {
    try {
      const response = await this.service.axiosInstance.post(
        '/api/alienvault/check-domain',
        { domain, integrationId: this.integrationId }
      )
      return this.transformResponse(response.data, domain, 'domain')
    } catch (error) {
      return this.createErrorResult(domain, 'domain', error)
    }
  }

  async analyzeHash(hash: string): Promise<IOCAnalysisResult> {
    try {
      const response = await this.service.axiosInstance.post(
        '/api/alienvault/check-hash',
        { hash, integrationId: this.integrationId }
      )
      return this.transformResponse(response.data, hash, 'hash')
    } catch (error) {
      return this.createErrorResult(hash, 'hash', error)
    }
  }

  async analyzeUrl(url: string): Promise<IOCAnalysisResult> {
    try {
      const response = await this.service.axiosInstance.post(
        '/api/alienvault/check-url',
        { url, integrationId: this.integrationId }
      )
      return this.transformResponse(response.data, url, 'url')
    } catch (error) {
      return this.createErrorResult(url, 'url', error)
    }
  }

  private transformResponse(
    response: { apiData: Record<string, unknown> },
    ioc: string,
    iocType: 'ip' | 'domain' | 'hash' | 'url'
  ): IOCAnalysisResult {
    return {
      provider: this.provider,
      iocValue: ioc,
      iocType,
      data:     response.apiData as Record<string, unknown>
    }
  }

  private createErrorResult(
    iocValue: string,
    iocType: 'ip' | 'domain' | 'hash' | 'url',
    error: Error | unknown
  ): IOCAnalysisResult {
    return {
      provider: this.provider,
      iocValue,
      iocType,
      data:     {},
      error:    error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }

}
