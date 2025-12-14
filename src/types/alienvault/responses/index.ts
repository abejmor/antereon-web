import type { BackendApiResponse } from '@/types/common/api'

export interface AlienVaultApiResponse extends BackendApiResponse<Record<string, unknown>> {}

export interface AlienVaultPulse {
  id: string
  name: string
  description: string
  author_name: string
  created: string
  modified: string
  tags: string[]
  malware_families: string[]
  attack_ids: string[]
  references: string[]
  targeted_countries: string[]
  industries: string[]
}

export interface AlienVaultIndicatorData {
  indicator: string
  type: string
  type_title: string
  base_indicator: {
    id: number
    indicator: string
    type: string
    title: string
    description: string
    content: string
    access_type: string
    access_reason: string
  }
  pulse_info: {
    count: number
    pulses: AlienVaultPulse[]
    references: string[]
    related: {
      alienvault: {
        adversary: string[]
        malware_families: string[]
        industries: string[]
      }
      other: {
        cymon: string[]
        urlvoid: string[]
        virustotal: string[]
      }
    }
  }
  false_positive: AlienVaultPulse[]
  validation: Array<{
    source: string
    message: string
    name: string
  }>
  asn: string
  city_data: boolean
  city: string
  region: string
  continent_code: string
  country_code3: string
  country_code2: string
  subdivision: string
  latitude: number
  postal_code: string
  longitude: number
  accuracy_radius: number
  country_code: string
  country_name: string
  dma_code: number
  charset: number
  area_code: number
  flag_url: string
  flag_title: string
  sections: string[]
  whois?: string
  reputation?: number
  alexa?: string
  file_type?: string
  size?: number
  ssdeep?: string
}
