import { Service } from './service'

export interface IOCAnalysisRequest {
  iocValue: string
  iocType: 'ip' | 'domain' | 'hash' | 'url'
  provider: string
  data: Record<string, any>
  analysisTimestamp: string
  error?: string
}

export interface IOCResultBase {
  id: string
  iocValue: string
  iocType: 'ip' | 'domain' | 'hash' | 'url'
  provider: string
  error?: string
  analysisTimestamp: Date
  createdAt: Date
}

export interface IOCAnalysisResult extends IOCResultBase {
  apiData: Record<string, any>
  userId: string
  updatedAt: Date
}

export interface IOCAnalysisHistoryParams {
  page?: number
  limit?: number
  search?: string
  type?: 'ip' | 'domain' | 'hash' | 'url'
  provider?: string
}

export interface IOCAnalysisHistoryResponse {
  results: IOCResultBase[];
  total: number;
  page: number;
  limit: number;
}

class IOCAnalysisService extends Service {
  get baseUrl() {
    return 'api/ioc-analysis'
  }

  async analyze(data: IOCAnalysisRequest): Promise<IOCAnalysisResult> {
    return this.axiosInstance.post(`${this.baseUrl}`, data).then(response => response.data)
  }

  async create(data: IOCAnalysisRequest): Promise<IOCAnalysisResult> {
    return this.analyze(data)
  }

  async getHistory(params?: IOCAnalysisHistoryParams): Promise<IOCAnalysisHistoryResponse> {
    return this.axiosInstance.get(`${this.baseUrl}`, { params }).then(response => response.data)
  }

  async getById(id: string): Promise<IOCAnalysisResult> {
    return this.axiosInstance.get(`${this.baseUrl}/${id}`).then(response => response.data)
  }

  async deleteResult(id: string): Promise<void> {
    return this.axiosInstance.delete(`${this.baseUrl}/${id}`).then(response => response.data)
  }

  async clearHistory(): Promise<void> {
    return this.axiosInstance.delete(`${this.baseUrl}/all`).then(response => response.data)
  }
}

export const iocAnalysisService = new IOCAnalysisService()
