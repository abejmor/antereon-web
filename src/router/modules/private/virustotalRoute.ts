import type { RouteRecordRaw } from 'vue-router'

export const virustotalRoute: RouteRecordRaw = {
  path:      '/virustotal',
  name:      'virustotal',
  component: () => import('@/views/virustotal/VirustotalView.vue'),
  meta:      {
    requiresAuth: true
  }
}
