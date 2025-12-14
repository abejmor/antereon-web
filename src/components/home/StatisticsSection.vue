<template>
  <v-row class="mb-8">
    <v-col cols="12">
      <v-card elevation="4">
        <v-card-title class="d-flex align-center pa-4">
          <v-icon
            icon="mdi-chart-line"
            class="me-3"
          />
          {{ t('home.statistics.title') }}
        </v-card-title>
        <v-card-text class="pa-4">
          <div
            v-if="loading"
            class="text-center py-8"
          >
            <v-progress-circular
              color="primary"
              size="48"
              indeterminate
            />
            <p class="text-body-2 text-medium-emphasis mt-4">
              {{ t('home.statistics.loading') }}
            </p>
          </div>
          <v-row
            v-else-if="hasStatistics"
            class="gy-4"
            justify="center"
          >
            <v-col
              v-for="stat in statistics"
              :key="stat.label"
              cols="12"
              sm="6"
              md="3"
              class="d-flex"
            >
              <v-card
                class="flex-fill d-flex flex-column pa-3"
                elevation="4"
                rounded="lg"
              >
                <v-card-title class="d-flex align-center pa-3">
                  <div>
                    <div class="text-h5 font-weight-bold">
                      {{ stat.value }}
                    </div>
                    <div class="text-body-2 text-medium-emphasis mt-1">
                      {{ t(stat.label) }}
                    </div>
                  </div>
                </v-card-title>
              </v-card>
            </v-col>
          </v-row>
          <div
            v-else
            class="text-center py-8"
          >
            <v-icon
              icon="mdi-chart-line-variant"
              size="48"
              class="text-medium-emphasis mb-4"
            />
            <p class="text-medium-emphasis">
              {{ t('home.statistics.empty') }}
            </p>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useStatistics } from '@/composables/useStatistics'

const { t } = useI18n()
const { loading, formattedSummary, loadSummaryStatistics } = useStatistics()

const statistics = computed(() => {
  return formattedSummary.value || [
    { label: 'home.statistics.total_searches', value: '0' },
    { label: 'home.statistics.active_integrations', value: '0' },
    { label: 'home.statistics.total_integrations', value: '0' },
    { label: 'home.statistics.top_provider', value: 'N/A' }
  ]
})

const hasStatistics = computed(() => {
  return statistics.value.length > 0
})

onMounted(() => {
  loadSummaryStatistics()
})
</script>
