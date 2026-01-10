<template>
  <div
    class="analysis-view"
    data-testid="analysis-view"
  >
    <v-container fluid>
      <IOCProviderHeader
        :title="t('analysis.title')"
        :description="t('analysis.description')"
        icon="mdi-magnify-scan"
        data-testid="analysis-header"
      />

      <v-row class="mb-6">
        <v-col
          cols="12"
          md="8"
        >
          <IOCSearchForm
            v-model:search-input="searchInput"
            :is-loading="isAnalyzing"
            :error="error"
            :detected-type="detectedType"
            :analyze-button-text="t('common.analyze')"
            :show-integration-selector="true"
            data-testid="search-form"
            @analyze="handleAnalyze"
            @integration-selected="handleIntegrationSelected"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <IOCQuickActions
            :has-results="hasResults"
            data-testid="quick-actions"
            @export="() => exportResults()"
            @clear="clearResults"
          />
        </v-col>
      </v-row>

      <v-row v-if="hasResults">
        <v-col cols="12">
          <div class="d-flex align-center mb-4">
            <v-icon
              icon="mdi-chart-line"
              class="mr-2"
            />
            <h2 class="text-h5">
              {{ t('common.analysis_results') }}
            </h2>
            <v-spacer />
            <v-chip
              color="primary"
              variant="tonal"
            >
              {{ results.length }} {{ t('common.result', results.length) }}
            </v-chip>
          </div>
        </v-col>
      </v-row>

      <v-row v-if="hasResults">
        <v-col
          v-for="result in results"
          :key="`${result.provider}-${result.iocValue}`"
          cols="12"
          md="6"
          lg="4"
        >
          <IOCCard
            :result="result"
            :loading="isAnalyzing"
            @view-details="openDetailsModal"
            @delete="handleDeleteResult"
          />
        </v-col>
      </v-row>

      <IOCEmptyState
        :has-results="hasResults"
        :is-loading="isAnalyzing"
        :title="t('common.no_analysis_yet')"
        :description="t('analysis.empty_state_description')"
        icon="mdi-shield-search"
      />
    </v-container>

    <IOCDetailsModal
      :show-modal="showDetailsModal"
      :result="selectedResult"
      @close="closeDetailsModal"
    />
  </div>
</template>

<script setup lang="ts">
import { useIOCAnalysis } from '@/composables/useIOCAnalysis'

import type { Integration } from '@/types/integration'

import {
  iocAnalysisService,
  type IOCResultBase,
  type IOCAnalysisResult
} from '@/services/iocAnalysisService'

const { t } = useI18n()
const {
  isAnalyzing,
  error,
  results,
  hasResults,
  analyzeIOC,
  detectIOCType,
  clearResults,
  removeResult,
  exportResults
} = useIOCAnalysis()

const searchInput = ref('')
const showDetailsModal = ref(false)
const selectedResult = ref<IOCAnalysisResult | null>(null)
const selectedIntegration = ref<Integration | null>(null)

const detectedType = computed(() => {
  if (!searchInput.value.trim()) return 'unknown'
  return detectIOCType(searchInput.value.trim())
})

const handleAnalyze = async () => {
  if (!searchInput.value.trim() || isAnalyzing.value || !selectedIntegration.value) return

  await analyzeIOC(searchInput.value.trim(), selectedIntegration.value.id)
}

const handleIntegrationSelected = (integration: Integration | null) => {
  selectedIntegration.value = integration
}

const openDetailsModal = async (result: IOCResultBase) => {
  const fullResult = await iocAnalysisService.getById(result.id)
  selectedResult.value = fullResult
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedResult.value = null
}

const handleDeleteResult = (result: IOCResultBase) => {
  removeResult(result.id)
}

watch(searchInput, () => {
  if (error.value) {
    error.value = null
  }
})
</script>
