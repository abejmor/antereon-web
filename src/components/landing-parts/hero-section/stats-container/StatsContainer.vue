<template>
  <div class="stats-container">
    <div class="provider-stats mb-4">
      <div class="provider-stats-header mb-2">
        <span class="text-subtitle-2 text-white">{{ t('landing.hero_section.dashboard.provider_stats.title') }}</span>
      </div>
      <div class="provider-grid">
        <div class="provider-item">
          <v-icon
            size="12"
            color="blue"
            class="me-1"
          >
            {{ getProviderIcon('virustotal') }}
          </v-icon>
          <span class="provider-name">{{ t('landing.hero_section.dashboard.provider_stats.virustotal') }}</span>
          <span class="provider-count">{{ formattedGlobalData?.analyses_by_provider?.virustotal || 0 }}</span>
        </div>
        <div class="provider-item">
          <v-icon
            size="12"
            color="green"
            class="me-1"
          >
            {{ getProviderIcon('alienvault') }}
          </v-icon>
          <span class="provider-name">{{ t('landing.hero_section.dashboard.provider_stats.alienvault') }}</span>
          <span class="provider-count">{{ formattedGlobalData?.analyses_by_provider?.alienvault || 0 }}</span>
        </div>
        <div class="provider-item">
          <v-icon
            size="12"
            color="red"
            class="me-1"
          >
            {{ getProviderIcon('abuseipdb') }}
          </v-icon>
          <span class="provider-name">{{ t('landing.hero_section.dashboard.provider_stats.abuseipdb') }}</span>
          <span class="provider-count">{{ formattedGlobalData?.analyses_by_provider?.abuseipdb || 0 }}</span>
        </div>
      </div>
    </div>

    <div class="ioc-type-stats">
      <div class="ioc-type-stats-header mb-2">
        <span class="text-subtitle-2 text-white">{{ t('landing.hero_section.dashboard.ioc_stats.title') }}</span>
      </div>
      <div class="ioc-type-grid">
        <div class="ioc-type-item">
          <v-icon
            size="12"
            color="primary"
            class="me-1"
          >
            mdi-web
          </v-icon>
          <span class="ioc-type-name">{{ t('landing.hero_section.dashboard.ioc_stats.domains') }}</span>
          <span class="ioc-type-count">{{ formattedGlobalData?.analyses_by_ioc_type?.domains || 0 }}</span>
        </div>
        <div class="ioc-type-item">
          <v-icon
            size="12"
            color="info"
            class="me-1"
          >
            mdi-ip-network
          </v-icon>
          <span class="ioc-type-name">{{ t('landing.hero_section.dashboard.ioc_stats.ips') }}</span>
          <span class="ioc-type-count">{{ formattedGlobalData?.analyses_by_ioc_type?.ips || 0 }}</span>
        </div>
        <div class="ioc-type-item">
          <v-icon
            size="12"
            color="warning"
            class="me-1"
          >
            mdi-file-code
          </v-icon>
          <span class="ioc-type-name">{{ t('landing.hero_section.dashboard.ioc_stats.hashes') }}</span>
          <span class="ioc-type-count">{{ formattedGlobalData?.analyses_by_ioc_type?.hashes || 0 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { getProviderIcon } from '@/helpers/iocHelpers'

interface Props {
  formattedGlobalData?: {
    analyses_by_provider?: {
      virustotal?: number
      alienvault?: number
      abuseipdb?: number
    }
    analyses_by_ioc_type?: {
      domains?: number
      ips?: number
      hashes?: number
    }
  }
}

defineProps<Props>()

const { t } = useI18n()
</script>

<style lang="scss" src="./StatsContainer.scss" scoped />
