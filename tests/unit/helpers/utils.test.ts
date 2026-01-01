import { describe, it, expect } from 'vitest'

import { formatDate, formatTableDate, formatDateOnly, getUserInitials } from '@/helpers/dateHelpers'

describe('utils helpers', () => {
  it('formats dates correctly', () => {
    const date = new Date('2024-01-15T10:30:00Z')
    expect(formatDate(date)).not.toBe('Invalid Date')
    expect(formatDate('2024-01-15')).toBeTruthy()
    expect(formatDate('invalid')).toBe('Invalid Date')

    expect(formatTableDate(date)).toContain('2024')
    expect(formatTableDate(new Date(1705315800000))).toBeTruthy()

    expect(formatDateOnly(date)).toBeTruthy()
    expect(formatDateOnly(date, 'es-ES')).toBeTruthy()
  })

  it('generates user initials', () => {
    expect(getUserInitials('Juan Pérez')).toBe('JP')
    expect(getUserInitials('María')).toBe('M')
    expect(getUserInitials('Ana María González')).toBe('AM')
    expect(getUserInitials('  Pedro   López  ')).toBe('PL')
    expect(getUserInitials('')).toBe('')
    expect(getUserInitials('José-María Ñuñez')).toBe('JÑ')
    expect(getUserInitials(null as any)).toBeDefined()
  })
})
