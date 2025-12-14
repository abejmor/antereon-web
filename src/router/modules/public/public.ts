import type { RouteRecordRaw } from 'vue-router'

import { authRoutes } from '@/router/modules/public/auth'
import { landingRoutes } from '@/router/modules/public/landing'

export const publicRoutes: RouteRecordRaw = {
  path:      '/',
  component: () => import('@/views/PublicAreaContainer.vue'),
  children:  [
    landingRoutes,
    ...authRoutes,
    {
      path:      '/privacy-policy',
      name:      'privacyPolicy',
      component: () => import('@/views/PrivacyPolicyView.vue'),
      meta:      { requiresAuth: false }
    }
  ],
  meta: { requiresAuth: false }
}
