import type { RouteRecordRaw } from 'vue-router'

export const profileRoute: RouteRecordRaw = {
  path:      '/profile',
  name:      'profile',
  component: () => import('@/views/profile/ProfileView.vue'),
  meta:      {
    requiresAuth: true
  }
}
