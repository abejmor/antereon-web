<template>
  <v-dialog
    :model-value="showModal"
    data-testid="ioc-details-modal"
    max-width="800px"
    scrollable
    @update:model-value="$emit('close')"
  >
    <v-card v-if="result">
      <v-card-title class="d-flex align-center">
        <v-icon
          :icon="getProviderIcon(result.provider)"
          :color="getProviderColor(result.provider)"
          class="mr-2"
        />
        <div class="flex-grow-1">
          <div class="text-h5">
            {{ result.iocValue }}
          </div>
          <div class="text-subtitle-2 text-medium-emphasis">
            {{ result.provider.toUpperCase() }} {{ t('history.modal.analysis_details') }}
          </div>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="$emit('close')"
        />
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <v-container>
          <v-row class="mb-4">
            <v-col cols="12">
              <h4 class="text-h6 mb-3">
                <v-icon
                  icon="mdi-information"
                  class="mr-2"
                />
                {{ t('history.modal.basic_info') }}
              </h4>
              <v-card variant="outlined">
                <v-list>
                  <v-list-item>
                    <v-list-item-title>{{ t('history.modal.ioc_value') }}</v-list-item-title>
                    <v-list-item-subtitle>{{ result.iocValue }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>{{ t('history.modal.ioc_type') }}</v-list-item-title>
                    <v-list-item-subtitle>{{ formatIOCType(result.iocType) }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>{{ t('history.modal.provider') }}</v-list-item-title>
                    <v-list-item-subtitle>{{ result.provider.toUpperCase() }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>{{ t('history.modal.analyzed_at') }}</v-list-item-title>
                    <v-list-item-subtitle>{{ formatDateWithTimezone(result.analysisTimestamp) }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>

          <v-row
            v-if="result.apiData && !result.error"
            class="mb-4"
          >
            <v-col cols="12">
              <h4 class="text-h6 mb-3">
                <v-icon
                  icon="mdi-chart-line"
                  class="mr-2"
                />
                {{ t('history.modal.analysis_data') }}
              </h4>
              <v-card variant="outlined">
                <v-card-text>
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-caption">{{ t('history.modal.json_data') }}</span>
                    <v-btn
                      :color="copied ? 'success' : 'primary'"
                      size="small"
                      variant="outlined"
                      @click="copyData"
                    >
                      <v-icon start>
                        {{ copied ? 'mdi-check' : 'mdi-content-copy' }}
                      </v-icon>
                      {{ copied ? t('history.modal.copied') : t('history.modal.copy') }}
                    </v-btn>
                  </div>
                  <JsonViewer
                    :value="result.apiData"
                    :theme="isDark ? 'dark' : 'light'"
                    :expand-depth="2"
                    sort
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row
            v-if="result.error"
            class="mb-4"
          >
            <v-col cols="12">
              <h4 class="text-h6 mb-3">
                <v-icon
                  icon="mdi-alert-circle"
                  class="mr-2"
                />
                {{ t('history.modal.error_details') }}
              </h4>
              <v-alert
                type="error"
                variant="tonal"
              >
                {{ result.error }}
              </v-alert>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-btn
          color="primary"
          variant="outlined"
          @click="exportResult"
        >
          <v-icon
            icon="mdi-download"
            class="mr-2"
          />
          {{ t('history.modal.export') }}
        </v-btn>

        <v-spacer />

        <v-btn
          color="primary"
          @click="$emit('close')"
        >
          {{ t('history.modal.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

import { useExport } from '@/composables/useExport'
import { useTheme } from '@/composables/useTheme'

import { getProviderIcon, getProviderColor, formatIOCType } from '@/helpers/iocHelpers'
import { formatDateWithTimezone } from '@/helpers/dateHelpers'

interface Props {
  showModal: boolean
  result: any | null
}

const props = defineProps<Props>()

defineEmits<{
  close: []
  delete: [result: any]
}>()

const { t } = useI18n()
const { exportToJSON } = useExport()
const { isDark } = useTheme()
const { copy, copied } = useClipboard()

const copyData = () => {
  if (props.result?.apiData) {
    copy(JSON.stringify(props.result.apiData, null, 2))
  }
}

const exportResult = () => {
  if (props.result) {
    exportToJSON(props.result, `ioc-analysis-${props.result.iocValue}.json`)
  }
}
</script>

<style scoped>
.analysis-data {
  background-color: rgb(var(--v-theme-surface-variant));
  padding: 16px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.4;
  max-height: 400px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
