import type { RouteRecordRaw } from 'vue-router'

export const analysisRoute: RouteRecordRaw = {
  path:      '/analysis',
  name:      'analysis',
  component: () => import('@/views/analysis/AnalysisView.vue'),
  meta:      {
    title:        'Analysis',
    icon:         'mdi-magnify-scan',
    requiresAuth: true
  }
}
