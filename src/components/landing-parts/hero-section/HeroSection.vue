<template>
  <v-sheet
    class="hero-section"
    color="surface"
  >
    <div class="particles-container">
      <div class="particle particle-1" />
      <div class="particle particle-2" />
      <div class="particle particle-3" />
      <div class="particle particle-4" />
      <div class="particle particle-5" />
      <div class="particle particle-6" />
    </div>

    <v-container
      class="py-16"
      fluid
    >
      <v-row
        align="center"
      >
        <v-col
          cols="12"
          md="6"
          class="d-flex flex-column justify-center pa-md-16 pa-6 hero-content"
        >
          <div class="d-flex align-center mb-4 hero-brand flex-column flex-sm-row">
            <div class="logo-container me-0 me-sm-4 mb-3 mb-sm-0">
              <v-img
                :src="logo"
                alt="antereon"
                width="48"
                height="48"
                class="logo-glow"
              />
            </div>
            <h1 class="text-h4 text-sm-h2 text-white font-weight-bold hero-title text-center text-sm-left">
              {{ t('landing.hero_section.heading_prefix') }} <span class="text-primary hero-highlight">{{ t('landing.hero_section.heading_highlight') }}</span> {{ t('landing.hero_section.heading_suffix') }}
            </h1>
          </div>
          <p class="text-body-1 text-white mb-8 hero-description">
            {{ t('landing.hero_section.description') }}
          </p>
          <div class="d-flex flex-wrap hero-buttons">
            <v-btn
              color="primary"
              size="large"
              class="me-4 hero-btn-primary"
              rounded="pill"
              elevation="4"
              to="/login"
            >
              {{ t('landing.hero_section.login_button') }}
              <v-icon end>
                mdi-login
              </v-icon>
            </v-btn>
            <v-btn
              variant="outlined"
              color="secondary"
              size="large"
              class="mb-2 hero-btn-secondary"
              rounded="pill"
              to="/register"
            >
              {{ t('landing.hero_section.register_button') }}
              <v-icon end>
                mdi-account-plus
              </v-icon>
            </v-btn>
          </div>
          <div class="mt-12 d-none d-md-flex hero-features">
            <div
              class="d-flex align-center me-6 hero-feature-item glass-card"
              @click="navigateToRegister"
            >
              <v-avatar
                color="surface-variant"
                class="me-2 hero-avatar"
              >
                <v-icon>mdi-lock-check</v-icon>
              </v-avatar>
              <span class="text-subtitle-2 text-white">{{ t('landing.hero_section.byoa_model') }}</span>
            </div>
            <div
              class="d-flex align-center hero-feature-item glass-card"
              @click="navigateToRegister"
            >
              <v-avatar
                color="surface-variant"
                class="me-2 hero-avatar"
              >
                <v-icon>mdi-api</v-icon>
              </v-avatar>
              <span class="text-subtitle-2 text-white">{{ t('landing.hero_section.apis_integrated') }}</span>
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          md="6"
          class="d-none d-md-block"
        >
          <div class="hero-dashboard-container glass-card-large d-flex flex-column justify-center">
            <div class="dashboard-header">
              <div class="d-flex align-center justify-space-between mb-4">
                <div class="d-flex align-center">
                  <v-icon
                    size="24"
                    color="primary"
                    class="me-2"
                  >
                    mdi-shield-search
                  </v-icon>
                  <span class="text-subtitle-1 font-weight-bold text-white">{{ t('landing.hero_section.platform_title') }}</span>
                </div>
                <div class="status-indicator">
                  <div class="pulse-dot" />
                  <span class="text-caption text-success">{{ t('landing.hero_section.status_live') }}</span>
                </div>
              </div>
            </div>

            <div class="threat-stats">
              <div class="stats-grid mb-6">
                <div class="stat-card">
                  <div class="stat-number">
                    {{ isLoadingGlobal ? '...' : (formattedGlobalData?.total_searches?.toLocaleString() || '0') }}
                  </div>
                  <div class="stat-label">
                    {{ t('landing.hero_section.dashboard.threat_stats.total_searches') }}
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">
                    {{ isLoadingGlobal ? '...' : (formattedGlobalData?.total_integrations || '0') }}
                  </div>
                  <div class="stat-label">
                    {{ t('landing.hero_section.dashboard.threat_stats.total_integrations') }}
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-number">
                    {{ isLoadingGlobal ? '...' : (formattedGlobalData?.active_integrations || '0') }}
                  </div>
                  <div class="stat-label">
                    {{ t('landing.hero_section.dashboard.threat_stats.active_apis') }}
                  </div>
                </div>
              </div>

              <NetworkVisualization />
              <StatsContainer :formatted-global-data="formattedGlobalData" />
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup lang="ts">
import { useGlobalStatistics } from '@/composables/useGlobalStatistics'

import logo from '@/assets/logo.png'

const { t } = useI18n()
const { formattedGlobalData, isLoadingGlobal, loadGlobalStatistics } = useGlobalStatistics()
const router = useRouter()

const navigateToRegister = () => {
  router.push({ name: 'register' })
}

onMounted(() => {
  loadGlobalStatistics()
})
</script>

<style lang="scss" src="./HeroSection.scss" scoped />
