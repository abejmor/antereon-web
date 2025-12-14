import type { RouteRecordRaw } from 'vue-router'

export const alienvaultRoute: RouteRecordRaw = {
  path:      '/alienvault',
  name:      'alienvault',
  component: () => import('@/views/alienvault/AlienvaultView.vue'),
  meta:      {
    requiresAuth: true
  }
}
