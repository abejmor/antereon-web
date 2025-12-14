import { Service } from './service'

class AuthService extends Service {
  get baseUrl() {
    return 'api/auth'
  }
  async login(email: string, password: string) {
    return this.axiosInstance.post(`${this.baseUrl}/login`, { email, password }).then(response => response.data)
  }
  async register(payload: any) {
    return this.axiosInstance.post(`${this.baseUrl}/register`, payload).then(response => response.data)
  }
  async getUserInfo() {
    return this.axiosInstance.get(`${this.baseUrl}/profile`).then(response => response.data)
  }
}

export const authService = new AuthService()
