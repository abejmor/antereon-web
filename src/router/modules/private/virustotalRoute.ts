import type { RouteRecordRaw } from 'vue-router'

export const virustotalRoute: RouteRecordRaw = {
  path:      '/virustotal',
  name:      'virustotal',
  component: () => import('@/views/provider/ProviderView.vue'),
  props:     { provider: 'virustotal' },
  meta:      {
    requiresAuth: true
  }
}
