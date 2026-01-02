import type { RouteRecordRaw } from 'vue-router'

export const alienvaultRoute: RouteRecordRaw = {
  path:      '/alienvault',
  name:      'alienvault',
  component: () => import('@/views/provider/ProviderView.vue'),
  props:     { provider: 'alienvault' },
  meta:      {
    requiresAuth: true
  }
}
