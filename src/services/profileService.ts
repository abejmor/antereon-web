import { Service } from './service'

export interface UpdateProfileRequest {
  name?: string
  email?: string
  theme?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ProfileResponse {
  id: string
  name: string
  email: string
  isActive: boolean
  theme: string
  createdAt: string
  updatedAt: string
}

class ProfileService extends Service {
  get baseUrl() {
    return 'api/auth'
  }

  async getProfile(): Promise<ProfileResponse> {
    return this.axiosInstance.get(`${this.baseUrl}/profile`).then(response => response.data)
  }

  async updateProfile(data: UpdateProfileRequest): Promise<ProfileResponse> {
    return this.axiosInstance.put(`${this.baseUrl}/profile`, data).then(response => response.data)
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    return this.axiosInstance.put(`${this.baseUrl}/profile/password`, data).then(response => response.data)
  }
}

export const profileService = new ProfileService()
