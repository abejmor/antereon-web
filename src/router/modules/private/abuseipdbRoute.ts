import type { RouteRecordRaw } from 'vue-router'

export const abuseipdbRoute: RouteRecordRaw = {
  path:      '/abuseipdb',
  name:      'abuseipdb',
  component: () => import('@/views/provider/ProviderView.vue'),
  props:     { provider: 'abuseipdb' },
  meta:      {
    requiresAuth: true
  }
}
