<template>
  <v-card
    :color="integration.provider?.color || 'primary'"
    :class="{ 'integration-card--clickable': clickable }"
    variant="outlined"
    class="integration-card"
    data-testid="integration-card"
    @click="handleCardClick"
  >
    <v-card-item>
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-avatar
            :color="integration.provider ? getIntegrationProvider(integration.provider.id)?.color : 'primary'"
            class="me-3"
            size="40"
          >
            <v-icon
              :icon="integration.provider ? getIntegrationProvider(integration.provider.id)?.icon : 'mdi-puzzle'"
              color="white"
            />
          </v-avatar>

          <div>
            <v-card-title class="text-h6 pa-0">
              {{ integration.name }} · {{ integration.provider ? getIntegrationProvider(integration.provider.id)?.name : t('integrations.custom_integration') }}
            </v-card-title>
            <div class="text-caption text-medium-emphasis">
              {{ integration.provider ? getIntegrationProvider(integration.provider.id)?.description : t('integrations.custom_integration') }}
            </div>
          </div>
        </div>
      </div>
    </v-card-item>

    <v-card-text>
      <div class="d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-chip
            :color="getStatusColor(integration.isActive)"
            size="small"
            variant="flat"
            class="text-caption"
          >
            <v-icon
              :icon="getStatusIcon(integration.isActive)"
              size="16"
              start
            />
            {{ getStatusText(integration.isActive) }}
          </v-chip>
        </div>

        <div class="text-caption text-medium-emphasis">
          {{ formatDate(integration.createdAt) }}
        </div>
      </div>

      <div
        v-if="showDetails"
        class="mt-3"
      >
        <v-divider class="mb-3" />
        <div class="text-caption">
          <div class="mb-1">
            <strong>URL:</strong>
            <a
              :href="integration.provider?.website"
              target="_blank"
              class="text-decoration-none ml-1"
            >
              {{ integration.provider?.website }}
            </a>
          </div>
          <div v-if="integration.updatedAt">
            <strong>{{ t('integrations.last_updated') }}:</strong> {{ formatDate(integration.updatedAt) }}
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { Integration } from '@/types/integration'

import { getIntegrationProvider } from '@/constants/integrations'
import { formatDateOnly } from '@/helpers/dateHelpers'
import { getIntegrationStatusColor } from '@/helpers/iocHelpers'

interface Props {
  integration: Integration
  showDetails?: boolean
  clickable?: boolean
}

interface Emits {
  click: [integration: Integration]
}

const { t } = useI18n()

const props = defineProps<Props>()

const emit = defineEmits<Emits>()

const integration = computed(() => ({
  ...props.integration,
  provider: getIntegrationProvider(props.integration.provider)
}))

const handleCardClick = () => {
  if (props.clickable) {
    emit('click', props.integration)
  }
}

const getStatusColor = (isActive: boolean) => {
  return getIntegrationStatusColor(isActive)
}

const getStatusIcon = (isActive: boolean) => {
  return isActive ? 'mdi-check-circle' : 'mdi-pause-circle'
}

const getStatusText = (isActive: boolean) => {
  return isActive ? t('integrations.status.active') : t('integrations.status.inactive')
}

const formatDate = (dateString: string) => {
  if (!dateString) return t('integrations.not_available')
  return formatDateOnly(dateString)
}
</script>
