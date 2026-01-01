import type { AbuseIPDBApiResponse } from '@/types/abuseIPDB/responses/ip'
import type { IOCAnalysisStrategy, IOCAnalysisResult } from '@/types/strategies/IOCAnalysisStrategy'

import { Service } from '@/services/service'

export class AbuseIPDBStrategy implements IOCAnalysisStrategy {
  readonly provider = 'abuseipdb'
  private service = new Service()
  private integrationId: string

  constructor(integrationId: string) {
    this.integrationId = integrationId
  }

  async analyzeIP(ip: string): Promise<IOCAnalysisResult> {
    try {
      const response = await this.service.axiosInstance.post<AbuseIPDBApiResponse>(
        '/api/abuseipdb/ip',
        { ip, integrationId: this.integrationId }
      )
      return this.transformResponse(response.data, ip)
    } catch (error) {
      return this.createErrorResult(ip, 'ip', error)
    }
  }

  async analyzeDomain(domain: string): Promise<IOCAnalysisResult> {
    return this.createUnsupportedResult(domain, 'domain')
  }

  async analyzeHash(hash: string): Promise<IOCAnalysisResult> {
    return this.createUnsupportedResult(hash, 'hash')
  }

  async analyzeUrl(url: string): Promise<IOCAnalysisResult> {
    return this.createUnsupportedResult(url, 'url')
  }

  private transformResponse(
    response: AbuseIPDBApiResponse,
    ip: string
  ): IOCAnalysisResult {
    return {
      provider: this.provider,
      iocValue: ip,
      iocType:  'ip' as const,
      data:     response.apiData as unknown as Record<string, unknown>
    }
  }

  private createErrorResult(
    iocValue: string,
    iocType: 'ip' | 'domain' | 'hash' | 'url',
    error: Error | unknown
  ): IOCAnalysisResult {
    let errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    if (errorMessage.includes('integration not found') || errorMessage.includes('not active')) {
      errorMessage = `Provider '${this.provider}' not available`
    }

    return {
      provider: this.provider,
      iocValue,
      iocType,
      data:     {},
      error:    errorMessage
    }
  }

  private createUnsupportedResult(
    iocValue: string,
    iocType: 'domain' | 'hash' | 'url'
  ): IOCAnalysisResult {
    return {
      provider: this.provider,
      iocValue,
      iocType,
      data:     {},
      error:    `AbuseIPDB only supports IP address analysis. ${iocType.toUpperCase()} analysis is not supported.`
    }
  }
}
