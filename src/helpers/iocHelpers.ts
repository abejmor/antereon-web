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
