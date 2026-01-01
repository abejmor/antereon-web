<template>
  <div
    class="alienvault-view"
    data-testid="alienvault-view"
  >
    <v-container fluid>
      <IOCProviderHeader
        :title="t('alienvault.title')"
        :description="t('alienvault.description')"
        icon="mdi-alien"
        data-testid="ioc-provider-header"
      />

      <v-row class="mb-6">
        <v-col
          cols="12"
          md="8"
        >
          <IOCSearchForm
            v-model:search-input="searchInput"
            :is-loading="isLoading"
            :error="error"
            :detected-type="detectedType"
            :provider="'alienvault'"
            :analyze-button-text="t('alienvault.analyze_button')"
            :show-integration-selector="true"
            data-testid="ioc-search-form"
            @analyze="handleAnalyze"
            @clear-error="clearError"
            @integration-selected="handleIntegrationSelected"
          />
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <IOCQuickActions
            :has-results="hasResults"
            data-testid="ioc-quick-actions"
            @export="exportResults"
            @clear="clearAllResults"
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
              {{ resultsArray.length }} {{ t('common.result', resultsArray.length) }}
            </v-chip>
          </div>
        </v-col>
      </v-row>

      <v-row v-if="hasResults">
        <v-col
          v-for="result in resultsArray"
          :key="`${result.provider}-${result.iocValue}`"
          cols="12"
          md="6"
          lg="4"
        >
          <IOCCard
            :result="result"
            :loading="isLoading"
            @view-details="openDetailsModal"
            @delete="handleDeleteResult"
          />
        </v-col>
      </v-row>

      <IOCEmptyState
        :has-results="hasResults"
        :is-loading="isLoading"
        :title="t('common.no_analysis_yet')"
        :description="t('alienvault.description')"
        :supported-types-title="t('common.supported_types')"
        icon="mdi-alien"
        provider="alienvault"
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

import IOCDetailsModal from '@/components/common/IOCDetailsModal.vue'
import IOCProviderHeader from '@/components/common/IOCProviderHeader.vue'
import IOCQuickActions from '@/components/common/IOCQuickActions.vue'
import IOCSearchForm from '@/components/common/IOCSearchForm.vue'

import type { IOCAnalysisResult } from '@/types/strategies/IOCAnalysisStrategy'
import type { Integration } from '@/types/integration'

import { iocAnalysisService, type IOCResultBase } from '@/services/iocAnalysisService'

const { t } = useI18n()
const {
  isLoading,
  error,
  results,
  hasResults,
  analyzeIOC,
  detectIOCType,
  clearError,
  clearResults,
  removeResult,
  exportResults: exportResultsComposable
} = useIOCAnalysis()

const searchInput = ref('')

const showDetailsModal = ref(false)
const selectedResult = ref<IOCAnalysisResult | null>(null)
const selectedIntegration = ref<Integration | null>(null)

const detectedType = computed(() => {
  if (!searchInput.value.trim()) return 'unknown'
  return detectIOCType(searchInput.value.trim())
})

const resultsArray = computed(() => {
  return Array.from(results.value.values())
})

watch(searchInput, () => {
  if (error.value) {
    clearError()
  }
})

const handleAnalyze = async () => {
  if (!searchInput.value.trim() || isLoading.value) return

  try {
    const provider = selectedIntegration.value?.id || 'alienvault'
    await analyzeIOC(searchInput.value.trim(), provider)
  } catch (err) {
    console.error('Error analyzing IOC:', err)
  }
}

const handleIntegrationSelected = (integration: Integration | null) => {
  selectedIntegration.value = integration
}

const openDetailsModal = async (result: IOCAnalysisResult | IOCResultBase) => {
  try {
    const fullResult = await iocAnalysisService.getById(result.id!)
    selectedResult.value = fullResult as any
    showDetailsModal.value = true
  } catch (err) {
    console.error('Error loading result details:', err)
  }
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedResult.value = null
}

const handleDeleteResult = async (result: IOCAnalysisResult | IOCResultBase) => {
  if (result.id) {
    removeResult(result.id)
  }
}

const exportResults = () => {
  exportResultsComposable('alienvault')
}

const clearAllResults = () => {
  clearResults()
}
</script>
