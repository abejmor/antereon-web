import type { RouteRecordRaw } from 'vue-router'

export const integrationsRoute: RouteRecordRaw = {
  path:      '/integrations',
  name:      'integrations',
  component: () => import('@/views/integrations/IntegrationsView.vue'),
  meta:      {
    requiresAuth: true
  }
}
