import { describe, it, expect, vi, beforeEach } from 'vitest'

import {
  getIOCTypeIcon, getIOCTypeLabel, getSupportedIOCTypes,
  getProviderIcon, getProviderColor, getStatusColor,
  getIntegrationStatusColor, formatStatus, formatIOCType
} from '@/helpers/iocHelpers'

vi.mock('vue-i18n', () => ({ useI18n: () => ({ t: (k: string) => `t_${k}` }) }))
vi.mock('@/constants/integrations', () => ({
  getIntegrationProvider: (p: string) => ({
    virustotal: { supportedIOCTypes: ['ip', 'domain'] },
    abuseipdb:  { supportedIOCTypes: ['ip'] }
  }[p])
}))

describe('iocHelpers', () => {
  beforeEach(() => vi.clearAllMocks())

  it.each([
    ['ip', 'mdi-ip-network'], ['domain', 'mdi-web'],
    ['hash', 'mdi-pound'], ['url', 'mdi-link'],
    ['unknown', 'mdi-help-circle'], [null, 'mdi-help-circle']
  ])('getIOCTypeIcon(%s) -> %s', (type, expected) => {
    expect(getIOCTypeIcon(type as any)).toBe(expected)
  })

  it.each([
    ['virustotal', 'mdi-virus'], ['abuseipdb', 'mdi-database-search'],
    ['alienvault', 'mdi-alien'], ['unknown', 'mdi-information']
  ])('getProviderIcon(%s) -> %s', (p, expected) => {
    expect(getProviderIcon(p)).toBe(expected)
  })

  it.each([
    ['virustotal', 'primary'], ['abuseipdb', 'success'],
    ['unknown', 'grey']
  ])('getProviderColor(%s) -> %s', (p, expected) => {
    expect(getProviderColor(p)).toBe(expected)
  })

  it.each([
    ['success', 'success'], ['error', 'error'],
    ['pending', 'warning'], ['unknown', 'grey']
  ])('getStatusColor(%s) -> %s', (s, expected) => {
    expect(getStatusColor(s)).toBe(expected)
  })

  it('getIntegrationStatusColor', () => {
    expect(getIntegrationStatusColor(true)).toBe('success')
    expect(getIntegrationStatusColor(false)).toBe('warning')
  })

  it('getSupportedIOCTypes', () => {
    expect(getSupportedIOCTypes('virustotal')).toEqual(['ip', 'domain'])
    expect(getSupportedIOCTypes('abuseipdb')).toEqual(['ip'])
    expect(getSupportedIOCTypes('unknown')).toEqual([])
  })

  it('formatters (Status/IOCType)', () => {
    expect(formatStatus('success')).toBe('t_history.status.success')
    expect(formatStatus('unknown')).toBe('unknown')
    expect(formatIOCType('ip')).toBe('t_ioc_type.ip')
    expect(formatIOCType('unknown')).toBe('unknown')
  })

  it('getIOCTypeLabel', () => {
    const t = (k: string) => `l_${k}`
    expect(getIOCTypeLabel('ip', t)).toBe('l_ioc_type.ip')
    expect(getIOCTypeLabel('unknown', t)).toBe('l_ioc_type.unknown')
  })
})
