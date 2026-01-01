import { useI18n } from 'vue-i18n'

import { getIntegrationProvider } from '@/constants/integrations'

export const getIOCTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    ip:      'mdi-ip-network',
    domain:  'mdi-web',
    hash:    'mdi-pound',
    url:     'mdi-link',
    unknown: 'mdi-help-circle'
  }
  return icons[type] || icons.unknown
}

export const getIOCTypeLabel = (type: string, _t: (_translationKey: string)=> string): string => {
  const labelKeys: Record<string, string> = {
    ip:      'ioc_type.ip',
    domain:  'ioc_type.domain',
    hash:    'ioc_type.hash',
    url:     'ioc_type.url',
    unknown: 'ioc_type.unknown'
  }
  return _t(labelKeys[type] || labelKeys.unknown)
}

export const getSupportedIOCTypes = (provider: string): string[] => {
  const integration = getIntegrationProvider(provider)
  return integration?.supportedIOCTypes || []
}

export const getProviderIcon = (provider: string): string => {
  const icons: Record<string, string> = {
    abuseipdb:  'mdi-database-search',
    virustotal: 'mdi-virus',
    alienvault: 'mdi-alien'
  }
  return icons[provider?.toLowerCase()] || 'mdi-information'
}

export const getProviderColor = (provider: string): string => {
  const colors: Record<string, string> = {
    virustotal: 'primary',
    abuseipdb:  'success',
    urlvoid:    'warning',
    hybrid:     'info'
  }
  return colors[provider.toLowerCase()] || 'grey'
}

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    success: 'success',
    error:   'error',
    pending: 'warning'
  }
  return colors[status] || 'grey'
}

export const getIntegrationStatusColor = (isActive: boolean): string => {
  return isActive ? 'success' : 'warning'
}

export const formatStatus = (status: string): string => {
  const { t } = useI18n()
  const statusMap: Record<string, string> = {
    success: t('history.status.success'),
    error:   t('history.status.error'),
    pending: t('history.status.pending')
  }
  return statusMap[status] || status
}

export const formatIOCType = (type: string): string => {
  const { t } = useI18n()
  const typeMap: Record<string, string> = {
    ip:     t('ioc_type.ip'),
    domain: t('ioc_type.domain'),
    url:    t('ioc_type.url'),
    hash:   t('ioc_type.hash')
  }
  return typeMap[type] || type
}

export const detectIOCType = (ioc: string): 'ip' | 'domain' | 'hash' | 'url' | 'unknown' => {
  if (!ioc || typeof ioc !== 'string') return 'unknown'

  const trimmedIOC = ioc.trim()
  if (!trimmedIOC) return 'unknown'

  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/
  const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i
  const domainRegex = /^(?!^\d+\.\d+\.\d+\.\d+$)[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  const hashRegex = /^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$/

  if (ipRegex.test(trimmedIOC)) return 'ip'
  if (urlRegex.test(trimmedIOC)) return 'url'
  if (hashRegex.test(trimmedIOC)) return 'hash'
  if (domainRegex.test(trimmedIOC)) return 'domain'

  return 'unknown'
}
