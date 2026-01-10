<template>
  <div
    class="history-view"
    data-testid="history-view"
  >
    <div class="history-header">
      <div class="header-content">
        <h1 class="page-title">
          {{ t('history.title') }}
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          {{ t('history.description') }}
        </p>
      </div>
      <div class="header-actions">
        <v-btn
          :disabled="!hasHistory || historyLoading"
          color="error"
          variant="outlined"
          @click="handleClearAll"
        >
          <v-icon start>
            mdi-delete-sweep
          </v-icon>
          {{ t('history.clear_all') }}
        </v-btn>
      </div>
    </div>

    <div class="filters-section">
      <v-card class="filters-card">
        <v-card-text>
          <v-row>
            <v-col
              cols="12"
              md="3"
            >
              <v-select
                v-model="filters.provider"
                :items="providerOptions"
                :label="t('history.filters.provider')"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col
              cols="12"
              md="3"
            >
              <v-select
                v-model="filters.iocType"
                :items="iocTypeOptions"
                :label="t('history.filters.ioc_type')"
                variant="outlined"
                density="compact"
                clearable
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="filters.iocValue"
                :label="t('history.filters.search_ioc')"
                variant="outlined"
                density="compact"
                clearable
              >
                <template #prepend-inner>
                  <v-icon>mdi-magnify</v-icon>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <div
      v-if="historyLoading"
      class="loading-section"
    >
      <v-card class="loading-card">
        <v-card-text class="text-center py-8">
          <v-progress-circular
            color="primary"
            size="64"
            indeterminate
          />
          <p class="mt-4 text-h6">
            {{ t('history.loading') }}
          </p>
        </v-card-text>
      </v-card>
    </div>

    <div
      v-else-if="hasHistory"
      class="results-section"
    >
      <div class="results-grid">
        <IOCCard
          v-for="result in historyResults"
          :key="result.id"
          :result="result"
          @view-details="handleViewDetails"
          @delete="handleDeleteResult"
        />
      </div>

      <div
        v-if="totalPages > 1"
        class="pagination-section"
      >
        <v-pagination
          v-model="currentPage"
          :length="totalPages"
          @update:model-value="handlePageChange"
        />
      </div>
    </div>

    <div
      v-else
      class="empty-section"
    >
      <v-card class="empty-card">
        <v-card-text class="text-center py-12">
          <v-icon
            size="80"
            color="grey-lighten-1"
          >
            mdi-history
          </v-icon>
          <h3 class="text-h5 mt-4 mb-2">
            {{ t('history.no_results') }}
          </h3>
          <p class="text-body-1 text-grey">
            {{ t('history.no_results_description') }}
          </p>
          <v-btn
            color="primary"
            class="mt-4"
            to="/analysis"
          >
            {{ t('history.perform_analysis') }}
          </v-btn>
        </v-card-text>
      </v-card>
    </div>

    <IOCDetailsModal
      :show-modal="showDetailsModal"
      :result="selectedResult"
      @close="closeDetailsModal"
    />
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

import {
  iocAnalysisService,
  type IOCAnalysisResult,
  type IOCResultBase
} from '@/services/iocAnalysisService'

const { t } = useI18n()

const historyLoading = ref(false)
const historyResults = ref<IOCResultBase[]>([])
const historyTotal = ref(0)
const historyError = ref<string | null>(null)
const selectedResult = ref<IOCAnalysisResult | null>(null)
const showDetailsModal = ref(false)
const currentPage = ref(1)
const itemsPerPage = 20

const filters = ref({
  provider: null as string | null,
  iocType:  null as string | null,
  iocValue: null as string | null
})

const providerOptions = computed(() => [
  { title: t('history.providers.virustotal'), value: 'virustotal' },
  { title: t('history.providers.abuseipdb'), value: 'abuseipdb' },
  { title: t('history.providers.alienvault'), value: 'alienvault' }
])

const iocTypeOptions = computed(() => [
  { title: t('history.ioc_types.ip'), value: 'ip' },
  { title: t('history.ioc_types.domain'), value: 'domain' },
  { title: t('history.ioc_types.hash'), value: 'hash' },
  { title: t('history.ioc_types.url'), value: 'url' }
])

const hasHistory = computed(() => historyResults.value.length > 0)
const totalPages = computed(() => Math.ceil(historyTotal.value / itemsPerPage))

const getCleanFilters = () => {
  return Object.fromEntries(
    Object.entries(filters.value).filter(([, value]) => value !== null && value !== '')
  )
}

const buildQuery = (cleanFilters: Record<string, any>) => ({
  page:     currentPage.value,
  limit:    itemsPerPage,
  iocValue: cleanFilters.iocValue || undefined,
  iocType:  cleanFilters.iocType || undefined,
  provider: cleanFilters.provider || undefined
})

const loadHistoryData = async () => {
  try {
    historyLoading.value = true
    historyError.value = null

    const cleanFilters = getCleanFilters()
    const query = buildQuery(cleanFilters)

    const response = await iocAnalysisService.getHistory(query)

    historyResults.value = response.results
    historyTotal.value = response.total
  } catch (error: any) {
    historyError.value = error.message || 'Error loading history'
    console.error('Error loading history:', error)

    historyResults.value = []
    historyTotal.value = 0
  } finally {
    historyLoading.value = false
  }
}

const debouncedSearch = useDebounceFn(() => {
  currentPage.value = 1
  loadHistoryData()
}, 500)

const handleViewDetails = async (result: IOCAnalysisResult | IOCResultBase) => {
  try {
    if (result.id) {
      const fullResult = await iocAnalysisService.getById(result.id)
      selectedResult.value = fullResult
    } else {
      selectedResult.value = result as IOCAnalysisResult
    }
    showDetailsModal.value = true
  } catch (err) {
    console.error('Error loading result details:', err)
    selectedResult.value = result as IOCAnalysisResult
    showDetailsModal.value = true
  }
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedResult.value = null
}

const handleDeleteResult = async (_result: IOCResultBase) => {
  try {
    await loadHistoryData()
  } catch (error) {
    console.error('Error refreshing history after delete:', error)
  }
}

const handleClearAll = async () => {
  try {
    await iocAnalysisService.clearHistory()
    await loadHistoryData()
  } catch (error) {
    console.error('Error clearing history:', error)
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadHistoryData()
}

watch(
  filters,
  () => {
    debouncedSearch()
  },
  { deep: true }
)

onMounted(() => {
  loadHistoryData()
})
</script>

<style scoped src="./HistoryView.scss" lang="scss" />
