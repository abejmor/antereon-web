import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

import { useAuthStore } from '@/stores/authStore'

const redirectGuestsToSignin = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  if (to.meta?.public) {
    return next()
  }

  return next({ name: 'register' })
}

const redirectIfEmailIsNull = (next: NavigationGuardNext) => {
  return next({ name: 'register' })
}

const validateUserLoginWithToken = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  return next()
}

export default (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthStore()

  if (authStore.authorized && (to.name === 'register' || to.name === 'login')) {
    return next({ name: 'home' })
  }

  if (to.meta?.loginWithToken && to.params.token) {
    return validateUserLoginWithToken(to, from, next)
  }

  if (!authStore.authorized && to.meta?.requiredEmail) {
    return redirectIfEmailIsNull(next)
  }
  if (!authStore.authorized && to.meta?.requiresAuth) {
    return redirectGuestsToSignin(to, from, next)
  }

  return next()
}
