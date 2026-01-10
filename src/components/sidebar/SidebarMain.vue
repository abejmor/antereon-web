<template>
  <v-navigation-drawer
    v-model="sidebarOpen"
    :permanent="!isMobile"
    :temporary="isMobile"
    width="280"
    app
  >
    <v-divider />
    <v-list
      density="compact"
      nav
    >
      <v-list-item
        :to="{ name: 'home' }"
        :title="t('sidebar.home')"
        prepend-icon="mdi-view-dashboard"
        color="primary"
        class="mb-1"
        exact
      />
      <v-list-item
        :to="{ name: 'analysis' }"
        :title="t('sidebar.analysis_tools')"
        prepend-icon="mdi-magnify-scan"
        color="primary"
        class="mb-1"
      />
      <v-list-item
        :to="{ name: 'history' }"
        :title="t('sidebar.history')"
        prepend-icon="mdi-history"
        color="primary"
        class="mb-1"
      />
      <v-list-subheader>{{ t('sidebar.settings') }}</v-list-subheader>
      <v-list-item
        :to="{ name: 'integrations' }"
        :title="t('sidebar.integrations')"
        prepend-icon="mdi-puzzle"
        color="primary"
        class="mb-1"
      />
      <v-list-item
        :to="{ name: 'profile' }"
        :title="t('sidebar.profile')"
        prepend-icon="mdi-account"
        color="primary"
        class="mb-1"
      />
    </v-list>

    <template #append>
      <div class="pa-4">
        <v-divider class="mb-4" />
        <div
          class="d-flex align-center pointer sidebar-profile pa-2"
          @click="handleLogout"
        >
          <v-avatar
            size="32"
            color="primary"
            class="me-3"
          >
            <span class="text-caption">{{ userInitials }}</span>
          </v-avatar>
          <div class="flex-grow-1">
            <div class="text-body-2 font-weight-medium">
              {{ authStore.user?.name }}
            </div>
            <div class="text-caption text-medium-emphasis">
              {{ authStore.user?.email }}
            </div>
          </div>
          <v-icon
            size="small"
            class="text-medium-emphasis"
          >
            mdi-logout
          </v-icon>
        </div>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useSidebar } from '@/composables/useSidebar'

import { useAuthStore } from '@/stores/authStore'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const { sidebarOpen, isMobile } = useSidebar()

const handleLogout = async () => {
  await authStore.removeSession()
  router.push({ name: 'login' })
}

import { getUserInitials } from '@/helpers/dateHelpers'

const userInitials = computed(() => {
  return getUserInitials(authStore.user?.name || '')
})
</script>
