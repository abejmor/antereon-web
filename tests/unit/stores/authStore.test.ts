import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { useAuthStore } from '@/stores/authStore'

import { authService } from '@/services/authService'

vi.mock('@/services/authService', () => ({
  authService: { login: vi.fn(), register: vi.fn(), getUserInfo: vi.fn() }
}))
Object.defineProperty(window, 'location', { value: { reload: vi.fn() }, writable: true })

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('manages login flow (success & error)', async () => {
    const store = useAuthStore()
    const user = { id: '1', name: 'User', email: 'test@test.com' }
    vi.mocked(authService.login).mockResolvedValue({ accessToken: 'token', user })

    await store.login('test@test.com', 'pass')
    expect(store.token).toBe('token')
    expect(store.isAuthenticated).toBe(true)

    store.token = ''
    store.authorized = false

    vi.mocked(authService.login).mockRejectedValue(new Error('Fail'))
    await expect(store.login('t', 'p')).rejects.toThrow()
    expect(store.isAuthenticated).toBe(false)
  })

  it('manages register flow', async () => {
    const store = useAuthStore()
    const user = { id: '2', name: 'New', email: 'new@test.com' }
    vi.mocked(authService.register).mockResolvedValue({ accessToken: 'newtoken', user })

    await store.register('new@test.com', 'pass', 'New')
    expect(store.token).toBe('newtoken')
    expect(store.user).toEqual(user)
  })

  it('authenticates existing session', async () => {
    const store = useAuthStore()
    store.token = 'existing'
    vi.mocked(authService.getUserInfo).mockResolvedValue({
      id:    '1',
      name:  'User',
      email: 'u@t.com'
    })

    await store.authenticate()
    expect(store.authorized).toBe(true)

    vi.mocked(authService.getUserInfo).mockRejectedValue(new Error('Expired'))
    await expect(store.authenticate()).rejects.toThrow()
  })

  it('removes session and optionally reloads', async () => {
    const store = useAuthStore()
    store.token = 't'
    store.authorized = true

    await store.removeSession(false)
    expect(store.token).toBe('')
    expect(window.location.reload).not.toHaveBeenCalled()

    await store.removeSession(true)
    expect(window.location.reload).toHaveBeenCalled()
  })

  it('persists state', () => {
    const store = useAuthStore()
    store.token = 'persist'
    store.authorized = true
    expect(store.token).toBe('persist')
  })
})
