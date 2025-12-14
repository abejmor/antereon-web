export interface Integration {
  id:            string
  name:          string
  provider:      string
  isActive:      boolean
  isDefault:     boolean
  configuration?: Record<string, any>
  createdAt:     string
  updatedAt:     string
}

export interface CreateIntegrationRequest {
  name:           string
  provider:       string
  apiKey:         string
  isDefault?:     boolean
  configuration?: Record<string, any>
}

export interface UpdateIntegrationRequest {
  name?:           string
  apiKey?:         string
  isActive?:       boolean
  isDefault?:      boolean
  configuration?:  Record<string, any>
}
