<template>
  <v-select
    :model-value="selectedIntegration"
    :items="availableIntegrations"
    :loading="loading"
    :disabled="loading || availableIntegrations.length === 0"
    :label="t('common.select_integration')"
    :placeholder="t('common.select_integration_placeholder')"
    item-title="name"
    item-value="id"
    variant="outlined"
    density="comfortable"
    @update:model-value="handleSelectionChange"
  >
    <template #item="{ props: itemProps, item }">
      <v-list-item v-bind="itemProps">
        <template #prepend>
          <v-avatar
            :color="item.raw.provider?.color || 'primary'"
            size="32"
          >
            <v-icon
              :icon="item.raw.provider?.icon || 'mdi-api'"
              color="white"
              size="16"
            />
          </v-avatar>
        </template>
        <v-list-item-subtitle>
          {{ item.raw.provider?.name }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>

    <template #selection="{ item }">
      <div class="d-flex align-center">
        <v-avatar
          :color="item.raw.provider?.color || 'primary'"
          size="24"
          class="me-2"
        >
          <v-icon
            :icon="item.raw.provider?.icon || 'mdi-api'"
            color="white"
            size="12"
          />
        </v-avatar>
        <span>{{ item.raw.name }}</span>
      </div>
    </template>

    <template #no-data>
      <div class="pa-4 text-center">
        <v-icon
          icon="mdi-alert-circle-outline"
          size="48"
          color="warning"
          class="mb-2"
        />
        <div class="text-body-2 text-medium-emphasis mb-2">
          {{ t('common.no_integrations_available') }}
        </div>
        <v-btn
          :to="{ name: 'integrations' }"
          color="primary"
          size="small"
          variant="outlined"
        >
          {{ t('common.add_integration') }}
        </v-btn>
      </div>
    </template>
  </v-select>
</template>

<script setup lang="ts">
import { useIntegrationsStore } from '@/stores/integrations'

import type { IntegrationProvider } from '@/constants/integrations'
import type { Integration } from '@/types/integration'

import { getIntegrationProvider } from '@/constants/integrations'

interface Props {
  provider?: string
  modelValue?: string | null
}

interface Emits {
  'update:modelValue': [value: string | null]
  'integration-selected': [integration: Integration | null]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t } = useI18n()
const integrationsStore = useIntegrationsStore()

const loading = computed(() => integrationsStore.loading)
const integrations = computed(() => integrationsStore.integrationsList)

const selectedIntegration = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value || null)
})

const availableIntegrations = computed(() => {
  let filtered = integrations.value.filter((integration) => integration.isActive)

  if (props.provider && props.provider.trim()) {
    filtered = filtered.filter(
      (integration) => integration.provider.toLowerCase() === props.provider!.toLowerCase()
    )
  }

  const enriched = filtered.map((integration) => ({
    ...integration,
    provider: getIntegrationProvider(integration.provider)
  })) as (Integration & { provider: IntegrationProvider | undefined })[]

  return enriched.sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1
    if (!a.isDefault && b.isDefault) return 1
    return a.name.localeCompare(b.name)
  })
})

const handleSelectionChange = (value: string | null) => {
  emit('update:modelValue', value)

  const selectedIntegrationObj = value
    ? availableIntegrations.value.find((integration) => integration.id === value)
    : null

  emit('integration-selected', selectedIntegrationObj || null)
}

watch(
  availableIntegrations,
  (newIntegrations) => {
    if (newIntegrations.length > 0 && !props.modelValue) {
      handleSelectionChange(newIntegrations[0].id)
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (integrationsStore.integrationsList.length === 0) {
    integrationsStore.getIntegrationsList()
  }
})
</script>
