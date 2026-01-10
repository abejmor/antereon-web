import type { RouteRecordRaw } from 'vue-router'

import { analysisRoute } from '@/router/modules/private/analysisRoute'
import { historyRoute } from '@/router/modules/private/historyRoute'
import { homeRoute } from '@/router/modules/private/homeRoute'
import { integrationsRoute } from '@/router/modules/private/integrationsRoute'
import { profileRoute } from '@/router/modules/private/profileRoute'

export const privateRoutes: RouteRecordRaw = {
  path:      '/',
  name:      'app',
  redirect:  '/home',
  component: () => import('@/views/PrivateAreaContainer.vue'),
  meta:      { requiresAuth: true },
  children:  [
    homeRoute,
    integrationsRoute,
    profileRoute,
    analysisRoute,
    historyRoute
  ]
}
