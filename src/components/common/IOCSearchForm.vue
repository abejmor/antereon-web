<template>
  <v-card
    elevation="2"
    class="pa-4"
  >
    <v-card-title class="text-h6 pa-0 mb-3">
      <v-icon
        icon="mdi-magnify"
        class="mr-2"
      />
      {{ t('common.search_ioc') }}
    </v-card-title>

    <v-form @submit.prevent="handleAnalyze">
      <v-row v-if="showIntegrationSelector">
        <v-col cols="12">
          <IntegrationSelector
            v-model="selectedIntegrationId"
            :provider="provider"
            @integration-selected="handleIntegrationSelected"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          md="8"
        >
          <v-text-field
            :model-value="searchInput"
            :loading="isLoading"
            :disabled="isLoading"
            :label="t('common.enter_ioc')"
            :placeholder="t('common.ioc_examples')"
            variant="outlined"
            density="comfortable"
            clearable
            @update:model-value="$emit('update:searchInput', $event ?? '')"
            @keyup.enter="handleAnalyze"
          >
            <template #prepend-inner>
              <v-icon
                :icon="getIOCTypeIcon(detectedType)"
                size="20"
              />
            </template>
          </v-text-field>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-btn
            :loading="isLoading"
            :disabled="
              !searchInput.trim() ||
                isLoading ||
                !isTypeSupported ||
                (showIntegrationSelector && !selectedIntegrationId)
            "
            type="submit"
            color="primary"
            size="large"
            block
          >
            <v-icon icon="mdi-magnify" />
            {{ analyzeButtonText }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <div
      v-if="searchInput.trim()"
      class="mt-3"
    >
      <v-chip
        :color="detectedType === 'unknown' || !isTypeSupported ? 'error' : 'success'"
        size="small"
        variant="tonal"
      >
        <v-icon
          :icon="getIOCTypeIcon(detectedType)"
          class="mr-1"
          size="16"
        />
        {{ t('common.detected_type') }}: {{ getIOCTypeLabel(detectedType, t) }}
        <span v-if="detectedType !== 'unknown' && !isTypeSupported">
          ({{ t('common.not_supported') }})
        </span>
      </v-chip>
    </div>

    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="mt-4"
      closable
      @click:close="$emit('clearError')"
    >
      {{ error }}
    </v-alert>
  </v-card>
</template>

<script setup lang="ts">
import type { Integration } from '@/types/integration'

import { getIOCTypeIcon, getIOCTypeLabel, getSupportedIOCTypes } from '@/helpers/iocHelpers'

interface Props {
  searchInput: string
  isLoading: boolean
  error?: string | null
  detectedType: string
  provider: string
  analyzeButtonText: string
  showIntegrationSelector?: boolean
}

interface Emits {
  'update:searchInput': [value: string]
  analyze: []
  clearError: []
  'integration-selected': [integration: Integration | null]
}

const props = withDefaults(defineProps<Props>(), {
  showIntegrationSelector: false,
  error:                   null
})
const emit = defineEmits<Emits>()

const { t } = useI18n()

const selectedIntegrationId = ref<string | null>(null)
const currentIntegration = ref<Integration | null>(null)

const selectedProviderId = computed(() => {
  if (!props.showIntegrationSelector) return props.provider
  return currentIntegration.value?.provider
})

const isTypeSupported = computed(
  () =>
    !!selectedProviderId.value &&
    !!props.searchInput.trim() &&
    props.detectedType !== 'unknown' &&
    getSupportedIOCTypes(selectedProviderId.value).includes(props.detectedType)
)

const handleAnalyze = () => {
  if (!props.searchInput.trim() || props.isLoading || !isTypeSupported.value) return
  if (props.showIntegrationSelector && !selectedIntegrationId.value) return
  emit('analyze')
}

const handleIntegrationSelected = (integration: Integration | null) => {
  currentIntegration.value = integration
  emit('integration-selected', integration)
}

watch(
  () => props.provider,
  () => {
    selectedIntegrationId.value = null
  }
)
</script>
