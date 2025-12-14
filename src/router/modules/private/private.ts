import type { RouteRecordRaw } from 'vue-router'

import { abuseipdbRoute } from '@/router/modules/private/abuseipdbRoute'
import { alienvaultRoute } from '@/router/modules/private/alienvaultRoute'
import { historyRoute } from '@/router/modules/private/historyRoute'
import { homeRoute } from '@/router/modules/private/homeRoute'
import { integrationsRoute } from '@/router/modules/private/integrationsRoute'
import { profileRoute } from '@/router/modules/private/profileRoute'
import { virustotalRoute } from '@/router/modules/private/virustotalRoute'

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
    virustotalRoute,
    alienvaultRoute,
    abuseipdbRoute,
    historyRoute
  ]
}
