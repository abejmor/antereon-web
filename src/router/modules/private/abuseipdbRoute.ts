import type { RouteRecordRaw } from 'vue-router'

export const abuseipdbRoute: RouteRecordRaw = {
  path:      '/abuseipdb',
  name:      'abuseipdb',
  component: () => import('@/views/abuseipdb/AbuseipdbView.vue'),
  meta:      {
    requiresAuth: true
  }
}
