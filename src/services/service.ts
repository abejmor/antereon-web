import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL
})

let interceptorsConfigured = false

const configureInterceptors = () => {
  if (interceptorsConfigured) return

  import('@/stores/authStore').then(({ useAuthStore }) => {
    axiosInstance.interceptors.request.use(
      (request) => {
        const authStore = useAuthStore()
        if (authStore.authorized && authStore.token) {
          request.headers.Authorization = `Bearer ${authStore.token}`
        }
        return request
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    axiosInstance.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        const status = error?.response?.status
        if (status === 401) {
          const authStore = useAuthStore()
          if (authStore.authorized) {
            authStore.removeSession(false)
          }
        }
        return Promise.reject(error)
      }
    )
  })

  interceptorsConfigured = true
}

export class Service {
  constructor() {
    configureInterceptors()
  }

  get axiosInstance() {
    return axiosInstance
  }
  get baseUrl() {
    return ''
  }
  async index(params: any) {
    return this.axiosInstance.get(this.baseUrl, { params }).then((response) => response.data)
  }
  async getById(id: string) {
    return this.axiosInstance.get(`${this.baseUrl}/${id}`).then((response) => response.data)
  }
  async create(model: any) {
    return this.axiosInstance.post(this.baseUrl, model).then((response) => response.data)
  }
  async update(id: string, model: any) {
    return this.axiosInstance.put(`${this.baseUrl}/${id}`, model).then((response) => response.data)
  }
  async delete(id: string) {
    return this.axiosInstance.delete(`${this.baseUrl}/${id}`).then((response) => response.data)
  }
}
