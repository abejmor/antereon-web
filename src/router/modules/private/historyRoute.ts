import type { RouteRecordRaw } from 'vue-router'

export const historyRoute: RouteRecordRaw = {
  path:      '/history',
  name:      'history',
  component: () => import('@/views/history/HistoryView.vue'),
  meta:      {
    title:        'Historial de Análisis',
    icon:         'mdi-history',
    requiresAuth: true
  }
}
