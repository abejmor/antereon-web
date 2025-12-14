export interface BackendApiResponse<T = any> {
  apiData: T
  status?: string
  message?: string
  error?: string
  timestamp?: string
}

export interface IOCAnalysisResponse<T = any> extends BackendApiResponse<T> {
  provider: string
  iocValue: string
  iocType: 'ip' | 'domain' | 'hash' | 'url'
}
