import type { BackendApiResponse } from '@/types/common/api'

export interface AbuseIPDBResponseData {
  ipAddress: string
  isPublic: boolean
  ipVersion: number
  isWhitelisted: boolean
  abuseConfidenceScore: number
  countryCode?: string
  countryName?: string
  usageType?: string
  isp?: string
  domain?: string
  hostnames: string[]
  isTor: boolean
  totalReports: number
  numDistinctUsers: number
  lastReportedAt?: string
  reports?: Array<{
    reportedAt: string
    comment: string
    categories: number[]
    reporterId: number
    reporterCountryCode: string
    reporterCountryName: string
  }>
}

export interface AbuseIPDBApiResponse extends BackendApiResponse<AbuseIPDBResponseData> {}
