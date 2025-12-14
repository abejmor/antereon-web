<template>
  <div class="home-view view-container">
    <div class="welcome-section section-spacing mb-8">
      <h1 class="text-h3 font-weight-bold mb-2">
        {{ t('home.welcome') }}, {{ authStore.user?.name }}
      </h1>
      <p class="text-h6 text-medium-emphasis">
        {{ t('home.subtitle') }}
      </p>
    </div>
    <StatisticsSection />
    <GlobalStatisticsSection />
    <IntegrationsSection />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'

const { t } = useI18n()
const authStore = useAuthStore()
</script>
