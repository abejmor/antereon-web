import { createRouter, createWebHistory } from 'vue-router'

import guards from './guards'
import { privateRoutes } from './modules/private/private'
import { publicRoutes } from './modules/public/public'

const routes = [publicRoutes, privateRoutes]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(guards)

export default router
