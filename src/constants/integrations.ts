import i18n from '@/plugins/i18n'

const { t } = i18n.global

export interface IntegrationProvider {
  id: string
  name: string
  description: string
  icon: string
  color: string
  website: string
  fields: IntegrationField[]
  supportedIOCTypes: ('ip' | 'domain' | 'hash' | 'url')[]
}

export interface IntegrationField {
  key: string
  label: string
  type: 'text' | 'password' | 'url'
  required: boolean
  placeholder?: string
  description?: string
}

export const AVAILABLE_INTEGRATIONS: IntegrationProvider[] = [
  {
    id:                'virustotal',
    name:              t('integrations.providers.virustotal.name'),
    description:       t('integrations.providers.virustotal.description'),
    icon:              'mdi-virus',
    color:             'blue',
    website:           'https://www.virustotal.com',
    supportedIOCTypes: ['ip', 'domain', 'hash', 'url'],
    fields:            [
      {
        key:         'api_key',
        label:       t('integrations.providers.virustotal.api_key_label'),
        type:        'password',
        required:    true,
        placeholder: t('integrations.providers.virustotal.api_key_placeholder'),
        description: t('integrations.providers.virustotal.api_key_description')
      }
    ]
  },
  {
    id:                'abuseipdb',
    name:              t('integrations.providers.abuseipdb.name'),
    description:       t('integrations.providers.abuseipdb.description'),
    icon:              'mdi-shield-alert',
    color:             'red',
    website:           'https://www.abuseipdb.com',
    supportedIOCTypes: ['ip'],
    fields:            [
      {
        key:         'api_key',
        label:       t('integrations.providers.abuseipdb.api_key_label'),
        type:        'password',
        required:    true,
        placeholder: t('integrations.providers.abuseipdb.api_key_placeholder'),
        description: t('integrations.providers.abuseipdb.api_key_description')
      }
    ]
  },
  {
    id:                'alienvault',
    name:              t('integrations.providers.alienvault.name'),
    description:       t('integrations.providers.alienvault.description'),
    icon:              'mdi-alien',
    color:             'green',
    website:           'https://otx.alienvault.com',
    supportedIOCTypes: ['ip', 'domain', 'hash', 'url'],
    fields:            [
      {
        key:         'api_key',
        label:       t('integrations.providers.alienvault.api_key_label'),
        type:        'password',
        required:    true,
        placeholder: t('integrations.providers.alienvault.api_key_placeholder'),
        description: t('integrations.providers.alienvault.api_key_description')
      }
    ]
  }
]

export const getIntegrationProvider = (id: string): IntegrationProvider | undefined => {
  return AVAILABLE_INTEGRATIONS.find(provider => provider.id === id)
}

export const formatProviderName = (providerId: string): string => {
  const provider = getIntegrationProvider(providerId)
  return provider ? provider.name : providerId.charAt(0).toUpperCase() + providerId.slice(1)
}
