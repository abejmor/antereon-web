<template>
  <v-card
    elevation="2"
    class="ioc-card"
  >
    <v-card-title class="d-flex align-center">
      <v-icon
        :icon="getProviderIcon(result.provider)"
        :color="getProviderColor(result.provider)"
        class="mr-2"
      />
      <div class="flex-grow-1 text-truncate">
        <v-tooltip location="top">
          <template #activator="{ props: tooltipProps }">
            <div
              v-bind="tooltipProps"
              class="text-h6 text-truncate"
            >
              {{ result.iocValue }}
            </div>
          </template>
          <span>{{ result.iocValue }}</span>
        </v-tooltip>
        <div class="text-caption text-medium-emphasis">
          {{ result.provider?.toUpperCase() }} • {{ result.iocType?.toUpperCase() }}
        </div>
      </div>
      <v-btn
        :loading="isDeleting"
        size="small"
        variant="text"
        color="error"
        icon
        @click="handleDelete"
      >
        <v-icon>mdi-delete</v-icon>
        <v-tooltip
          activator="parent"
          location="top"
        >
          {{ t('history.card.delete') }}
        </v-tooltip>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <div class="mb-3">
        <div
          v-if="result.analysisTimestamp"
          class="text-body-2 mb-1"
        >
          <strong>{{ t('history.card.analysis') }}:</strong> {{ formatDateWithTimezone(result.analysisTimestamp) }}
        </div>
        <div
          v-if="result.createdAt"
          class="text-body-2 mb-1"
        >
          <strong>{{ t('history.card.saved') }}:</strong> {{ formatDateWithTimezone(result.createdAt) }}
        </div>
      </div>

      <div v-if="result.error">
        <v-divider class="mb-3" />
        <div class="text-caption text-error">
          Error: {{ result.error }}
        </div>
      </div>

      <div class="mt-4 d-flex justify-end">
        <v-btn
          size="small"
          variant="outlined"
          color="primary"
          @click="$emit('view-details', result)"
        >
          {{ t('history.card.view_details') }}
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { getProviderIcon, getProviderColor } from '@/helpers/iocHelpers'
import { formatDateWithTimezone } from '@/helpers/utils'
import { iocAnalysisService } from '@/services/iocAnalysisService'

interface Props {
  result: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'view-details': [result: any]
  'delete': [result: any]
}>()

const { t } = useI18n()
const isDeleting = ref(false)

const handleDelete = async () => {
  if (!props.result?.id) return

  try {
    isDeleting.value = true
    await iocAnalysisService.deleteResult(props.result.id)
    emit('delete', props.result)
  } catch (error) {
    console.error('Error deleting IOC result:', error)
  } finally {
    isDeleting.value = false
  }
}
</script>
