<template>
  <v-row class="mb-8">
    <v-col cols="12">
      <v-card elevation="4">
        <v-card-title class="d-flex align-center pa-4">
          <v-icon
            icon="mdi-chart-box"
            class="me-3"
          />
          {{ t('home.global_statistics.title') }}
        </v-card-title>
        <v-card-text class="pa-4">
          <div
            v-if="isLoading"
            class="text-center py-8"
          >
            <v-progress-circular
              color="primary"
              size="48"
              indeterminate
            />
            <p class="text-body-2 text-medium-emphasis mt-4">
              {{ t('home.global_statistics.loading') }}
            </p>
          </div>
          <div
            v-else-if="error"
            class="text-center py-8"
          >
            <v-icon
              icon="mdi-alert-circle"
              size="48"
              class="text-medium-emphasis mb-4"
            />
            <p class="text-medium-emphasis mb-4">
              {{ t('home.global_statistics.error') }}
            </p>
            <v-btn
              color="primary"
              variant="outlined"
              @click="loadGlobalStatistics"
            >
              {{ t('home.global_statistics.retry') }}
            </v-btn>
          </div>
          <v-row
            v-else
            class="gy-4"
            justify="center"
          >
            <v-col
              cols="6"
              md="4"
            >
              <v-card
                class="flex-fill d-flex flex-column pa-3"
                elevation="4"
                rounded="lg"
              >
                <v-card-title class="d-flex align-center pa-3">
                  <div>
                    <div class="text-h5 font-weight-bold">
                      {{ stats.totalSearches.toLocaleString() }}
                    </div>
                    <div class="text-body-2 text-medium-emphasis mt-1">
                      {{ t('home.global_statistics.total_searches') }}
                    </div>
                  </div>
                </v-card-title>
              </v-card>
            </v-col>
            <v-col
              cols="6"
              md="4"
            >
              <v-card
                class="flex-fill d-flex flex-column pa-3"
                elevation="4"
                rounded="lg"
              >
                <v-card-title class="d-flex align-center pa-3">
                  <div>
                    <div class="text-h5 font-weight-bold">
                      {{ stats.activeIntegrations.toLocaleString() }}
                    </div>
                    <div class="text-body-2 text-medium-emphasis mt-1">
                      {{ t('home.global_statistics.active_integrations') }}
                    </div>
                  </div>
                </v-card-title>
              </v-card>
            </v-col>
            <v-col
              cols="6"
              md="4"
            >
              <v-card
                class="flex-fill d-flex flex-column pa-3"
                elevation="4"
                rounded="lg"
              >
                <v-card-title class="d-flex align-center pa-3">
                  <div>
                    <div class="text-h5 font-weight-bold">
                      {{ stats.totalIntegrations.toLocaleString() }}
                    </div>
                    <div class="text-body-2 text-medium-emphasis mt-1">
                      {{ t('home.global_statistics.total_integrations') }}
                    </div>
                  </div>
                </v-card-title>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useGlobalStatistics } from '@/composables/useGlobalStatistics'

const { t } = useI18n()

const {
  globalStatisticsData,
  isLoading,
  error,
  loadGlobalStatistics
} = useGlobalStatistics()

const stats = computed(() => {
  if (!globalStatisticsData.value) {
    return {
      totalSearches:      0,
      activeIntegrations: 0,
      totalIntegrations:  0,
      totalIOCAnalyses:   0,
      analysesByProvider: {},
      analysesByType:     { domain: 0, ip: 0, hash: 0 }
    }
  }
  return globalStatisticsData.value
})

onMounted(() => {
  loadGlobalStatistics()
})
</script>
