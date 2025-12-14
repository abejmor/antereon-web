import { defineStore } from 'pinia'

import { authService } from '@/services/authService'

interface User {
  id: string
  name: string
  email: string
  theme: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authorized: false,
    token: '',
    user: null as User | null,
  }),
  getters: {
    isAuthenticated: (state) => state.authorized && !!state.token,
  },
  actions: {
    async login(email: string, password: string) {
      const response = await authService.login(email, password)
      this.authorized = true
      this.token = response.accessToken
      this.user = response.user
    },
    async register(email: string, password: string, name: string) {
      const response = await authService.register({ email, password, name })
      this.authorized = true
      this.token = response.accessToken
      this.user = response.user
    },
    async authenticate() {
      this.authorized = true
      this.user = await authService.getUserInfo()
    },
    async removeSession(reload: boolean = true) {
      this.authorized = false
      this.token = ''
      this.user = null
      if (reload) {
        window.location.reload()
      }
    },
  },
  persist: {
    pick: ['authorized', 'token', 'user'],
  },
})
