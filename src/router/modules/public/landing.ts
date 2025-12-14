import type { RouteRecordRaw } from 'vue-router'

export const landingRoutes: RouteRecordRaw = {
  path:      '',
  component: () => import('@/views/landing/LandingView.vue')
}
