import type { BackendApiResponse } from '@/types/common/api'

export interface VirusTotalBaseResponse<T> extends BackendApiResponse<T> {}

export interface VirusTotalObject<T> {
  data: {
    type: string,
    id: string,
    links?: {
      self: string
    },
    attributes: T,
    relationships?: any
  }
}
