import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    path:      '/login',
    name:      'login',
    component: () => import('@/views/login/LoginView.vue'),
    meta:      { requiresAuth: false }
  }, {
    path:      '/register',
    name:      'register',
    component: () => import('@/views/register/RegisterView.vue'),
    meta:      { requiresAuth: false }
  }
]
