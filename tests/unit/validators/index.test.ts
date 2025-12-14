import { describe, it, expect } from 'vitest'

import { email, password, minLength, maxLength, url, same, required } from '@/validators'

describe('validators', () => {
  it.each([
    ['test@example.com', true], ['user.name@domain.co.uk', true], ['test+tag@gmail.com', true],
    ['invalid-email', false], ['@domain.com', false], ['', false], [null, false]
  ])('email(%s) -> %s', (val, expected) => expect(email(val as any) === true).toBe(expected))

  it.each([
    ['Password123!', true], ['MyStr0ng@Pass', true],
    ['123456', false], ['password', false], ['short', false]
  ])('password(%s) -> %s', (val, expected) => expect(password(val) === true).toBe(expected))

  it.each([
    ['https://example.com', true], ['http://domain.com', true],
    ['not-a-url', false], ['ftp://example.com', false], ['', false]
  ])('url(%s) -> %s', (val, expected) => expect(url(val) === true).toBe(expected))

  it.each([
    ['val', true], [0, true], [false, true],
    ['', false], [null, false], [undefined, false]
  ])('required(%s) -> %s', (val, expected) => expect(required(val) === true).toBe(expected))

  it('length validators', () => {
    expect(minLength(5)('hello')).toBe(true)
    expect(minLength(5)('hi')).not.toBe(true)
    expect(maxLength(5)('short')).toBe(true)
    expect(maxLength(5)('too long text')).not.toBe(true)
  })

  it('same validator', () => {
    expect(same('pass')('pass')).toBe(true)
    expect(same('pass')('diff')).not.toBe(true)
    expect(same('123')('123')).toBe(true)
  })
})
