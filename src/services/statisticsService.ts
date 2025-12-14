import { Service } from './service'

export interface StatisticsData {
  totalSearches: number
  activeIntegrations: number
  totalIntegrations: number
  totalIOCAnalyses?: number
  analysesByProvider?: Record<string, number>
  analysesByType?: Record<string, number>
  topProviders: Array<{
    name: string
    provider: string
    searches: number
  }>
}

export interface StatisticsSummary {
  totalSearches: number
  activeIntegrations: number
  totalIntegrations: number
  topProviders: Array<{
    name: string
    provider: string
    searches: number
  }>
}

class StatisticsService extends Service {
  get baseUrl() {
    return 'api/statistics'
  }

  async getHomeStatistics(): Promise<StatisticsData> {
    return this.axiosInstance.get(`${this.baseUrl}/home`).then(response => response.data)
  }

  async getSummary(): Promise<StatisticsSummary> {
    return this.axiosInstance.get(`${this.baseUrl}/summary`).then(response => response.data)
  }

  async getGlobalStatistics(): Promise<StatisticsData> {
    return this.axiosInstance.get(`${this.baseUrl}/all`).then(response => response.data)
  }
}

export const statisticsService = new StatisticsService()
