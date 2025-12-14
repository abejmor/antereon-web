import type { IOCAnalysisStrategy, IOCAnalysisResult } from './IOCAnalysisStrategy'
import type { VirusTotalBaseResponse } from '@/types/virustotal/responses/common'

import { Service } from '@/services/service'

export class VirusTotalStrategy implements IOCAnalysisStrategy {
  readonly provider = 'virustotal'
  private service = new Service()
  private integrationId: string

  constructor(integrationId: string) {
    this.integrationId = integrationId
  }

  async analyzeIP(ip: string): Promise<IOCAnalysisResult> {
    try {
      const response = await this.service.axiosInstance.post<VirusTotalBaseResponse<any>>(
        '/api/virustotal/check-ip',
        { ip, integrationId: this.integrationId }
      )
      return this.transformResponse(response.data, ip, 'ip')
    } catch (error) {
      return this.createErrorResult(ip, 'ip', error)
    }
  }

  async analyzeDomain(domain: string): Promise<IOCAnalysisResult> {
    try {
      const response = await this.service.axiosInstance.post<VirusTotalBaseResponse<any>>(
        '/api/virustotal/check-domain',
        { domain, integrationId: this.integrationId }
      )
      return this.transformResponse(response.data, domain, 'domain')
    } catch (error) {
      return this.createErrorResult(domain, 'domain', error)
    }
  }

  async analyzeHash(hash: string): Promise<IOCAnalysisResult> {
    try {
      const response = await this.service.axiosInstance.post<VirusTotalBaseResponse<any>>(
        '/api/virustotal/check-hash',
        { hash, integrationId: this.integrationId }
      )
      return this.transformResponse(response.data, hash, 'hash')
    } catch (error) {
      return this.createErrorResult(hash, 'hash', error)
    }
  }

  async analyzeUrl(url: string): Promise<IOCAnalysisResult> {
    try {
      const params = this.integrationId ? { integrationId: this.integrationId } : {}
      const response = await this.service.axiosInstance.post<VirusTotalBaseResponse<any>>(
        '/api/virustotal/analyze-url',
        { url },
        { params }
      )
      return this.transformResponse(response.data, url, 'url')
    } catch (error) {
      return this.createErrorResult(url, 'url', error)
    }
  }

  private transformResponse(
    response: VirusTotalBaseResponse<any>,
    ioc: string,
    iocType: 'ip' | 'domain' | 'hash' | 'url'
  ): IOCAnalysisResult {
    return {
      provider: this.provider,
      iocValue: ioc,
      iocType,
      data:     response.apiData as unknown as Record<string, unknown>
    }
  }

  private createErrorResult(
    iocValue: string,
    iocType: 'ip' | 'domain' | 'hash' | 'url',
    error: any
  ): IOCAnalysisResult {
    return {
      provider: this.provider,
      iocValue,
      iocType,
      data:     {},
      error:    error?.message || 'Unknown error occurred'
    }
  }
}
