import type { RouteRecordRaw } from 'vue-router'

export const homeRoute: RouteRecordRaw = {
  path:      '/home',
  name:      'home',
  component: () => import('@/views/home/HomeView.vue'),
  meta:      {
    requiresAuth: true
  }
}
