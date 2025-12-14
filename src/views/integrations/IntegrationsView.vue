<template>
  <div class="view-container" data-testid="integrations-view">
    <div class="d-flex align-center justify-space-between mb-6" data-testid="header-section">
      <div data-testid="title-section">
        <h1 class="text-h4 font-weight-bold mb-2" data-testid="page-title">
          {{ t('integrations.title') }}
        </h1>
        <p class="text-body-1 text-medium-emphasis" data-testid="page-description">
          {{ t('integrations.manage_description') }}
        </p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        data-testid="new-integration-button"
        @click="openCreateDialog"
      >
        {{ t('integrations.new_integration') }}
      </v-btn>
    </div>

    <div class="d-flex gap-4 mb-6" data-testid="filters-section">
      <v-text-field
        :model-value="integrationsStore.integrationsFilters.search"
        :label="t('integrations.search_placeholder')"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        data-testid="search-filter"
        clearable
        @update:model-value="(value: string) => setFilters('search', value || '')"
      />

      <v-select
        :model-value="integrationsStore.integrationsFilters.provider"
        :items="integrationsStore.providerOptions"
        :label="t('integrations.provider')"
        item-title="label"
        item-value="id"
        variant="outlined"
        density="compact"
        data-testid="provider-filter"
        multiple
        clearable
        @update:model-value="(value: string[]) => setFilters('provider', value || [])"
      />

      <v-select
        :model-value="integrationsStore.integrationsFilters.status"
        :items="integrationsStore.statusOptions"
        :label="t('integrations.status.label')"
        item-title="label"
        item-value="id"
        variant="outlined"
        density="compact"
        data-testid="status-filter"
        multiple
        clearable
        @update:model-value="(value: string[]) => setFilters('status', value || [])"
      />
    </div>

    <v-card data-testid="integrations-table-card">
      <v-data-table
        :headers="headers"
        :items="integrationsStore.integrationsList"
        :loading="integrationsStore.loading"
        :no-data-text="t('integrations.no_integrations')"
        item-value="id"
        class="elevation-0"
        data-testid="integrations-table"
      >
        <template #[`item.provider`]="{ item }">
          <div class="d-flex align-center" data-testid="provider-cell">
            <v-avatar
              :color="getProviderColor(item.provider)"
              size="32"
              class="me-2"
              data-testid="provider-avatar"
            >
              <v-icon
                :icon="getProviderIcon(item.provider)"
                color="white"
                size="16"
                data-testid="provider-icon"
              />
            </v-avatar>
            {{ getProviderName(item.provider) }}
          </div>
        </template>

        <template #[`item.isActive`]="{ item }">
          <v-switch
            :model-value="item.isActive"
            color="primary"
            density="compact"
            data-testid="status-switch"
            hide-details
            @update:model-value="(value: boolean | null) => handleStatusToggle(item, value)"
          />
        </template>

        <template #[`item.createdAt`]="{ item }">
          <span class="text-body-2" data-testid="created-date">
            {{ formatTableDate(item.createdAt) }}
          </span>
        </template>

        <template #[`item.actions`]="{ item }">
          <div class="d-flex gap-2" data-testid="actions-cell">
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              data-testid="edit-button"
              @click="openEditDialog(item)"
            />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              data-testid="delete-button"
              @click="openDeleteDialog(item)"
            />
          </div>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog
      v-model="formModal.showModal.value"
      max-width="600px"
      data-testid="form-dialog"
      persistent
    >
      <IntegrationForm
        :integration="selectedIntegration"
        :loading="formLoading"
        data-testid="integration-form"
        @submit="handleFormSubmit"
        @cancel="closeFormDialog"
      />
    </v-dialog>

    <v-dialog v-model="deleteModal.showModal.value" max-width="400px" data-testid="delete-dialog">
      <v-card data-testid="delete-card">
        <v-card-title class="text-h6" data-testid="delete-title">
          {{ t('integrations.delete.title') }}
        </v-card-title>
        <v-card-text data-testid="delete-message">
          {{ t('integrations.delete.message', { name: selectedIntegration?.name }) }}
        </v-card-text>
        <v-card-actions data-testid="delete-actions">
          <v-spacer />
          <v-btn variant="text" data-testid="cancel-delete-button" @click="closeDeleteDialog">
            {{ t('common.cancel') }}
          </v-btn>
          <v-btn
            :loading="deleteLoading"
            color="error"
            variant="text"
            data-testid="confirm-delete-button"
            @click="handleDelete"
          >
            {{ t('common.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      data-testid="snackbar"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { useSnackbar } from '@/composables/useAlert'
import { useModal } from '@/composables/useModal'

import { useIntegrationsStore } from '@/stores/integrations'
import type { IntegrationsListFilters } from '@/stores/integrations'

import IntegrationForm from '@/components/integrations/IntegrationForm.vue'

import type {
  Integration,
  CreateIntegrationRequest,
  UpdateIntegrationRequest,
} from '@/types/integration'

import { getIntegrationProvider } from '@/constants/integrations'
import { getProviderIcon, getProviderColor } from '@/helpers/iocHelpers'
import { formatTableDate } from '@/helpers/utils'

const { t } = useI18n()
const integrationsStore = useIntegrationsStore()
const { showSnackbar, snackbar } = useSnackbar()
const formModal = useModal()
const deleteModal = useModal()

const formLoading = ref(false)
const deleteLoading = ref(false)
const selectedIntegration = ref<Integration | undefined>()

const headers = computed(() => [
  {
    title: t('integrations.table.name'),
    key: 'name',
    sortable: true,
  },
  {
    title: t('integrations.table.provider'),
    key: 'provider',
    sortable: true,
  },
  {
    title: t('integrations.table.status'),
    key: 'isActive',
    sortable: true,
  },
  {
    title: t('integrations.table.created'),
    key: 'createdAt',
    sortable: true,
  },
  {
    title: t('common.actions'),
    key: 'actions',
    sortable: false,
  },
])

const getProviderName = (providerId: string): string => {
  const provider = getIntegrationProvider(providerId)
  return provider ? provider.name : providerId
}

const setFilters = <K extends keyof IntegrationsListFilters>(
  key: K,
  value: IntegrationsListFilters[K],
) => {
  integrationsStore.setFilters(key, value)
  getIntegrationsList()
}

const openCreateDialog = () => {
  selectedIntegration.value = undefined
  formModal.openModal()
}

const openEditDialog = (integration: Integration) => {
  selectedIntegration.value = integration
  formModal.openModal()
}

const closeFormDialog = () => {
  formModal.closeModal()
  selectedIntegration.value = undefined
}

const openDeleteDialog = (integration: Integration) => {
  selectedIntegration.value = integration
  deleteModal.openModal()
}

const closeDeleteDialog = () => {
  deleteModal.closeModal()
  selectedIntegration.value = undefined
}

const handleFormSubmit = async (data: CreateIntegrationRequest | UpdateIntegrationRequest) => {
  formLoading.value = true

  try {
    if (selectedIntegration.value) {
      await integrationsStore.updateIntegration(
        selectedIntegration.value.id,
        data as UpdateIntegrationRequest,
      )
      showSnackbar(t('integrations.messages.updated'), 'success')
    } else {
      await integrationsStore.createIntegration(data as CreateIntegrationRequest)
      showSnackbar(t('integrations.messages.created'), 'success')
    }
    closeFormDialog()
  } catch (error) {
    console.error('Error submitting form:', error)
    showSnackbar(t('integrations.messages.error'), 'error')
  } finally {
    formLoading.value = false
  }
}

const handleDelete = async () => {
  if (!selectedIntegration.value) return

  deleteLoading.value = true

  try {
    await integrationsStore.deleteIntegration(selectedIntegration.value.id)
    showSnackbar(t('integrations.messages.deleted'), 'success')
    closeDeleteDialog()
  } catch (error) {
    console.error('Error deleting integration:', error)
    showSnackbar(t('integrations.messages.error'), 'error')
  } finally {
    deleteLoading.value = false
  }
}

const handleStatusToggle = async (integration: Integration, isActive: boolean | null) => {
  if (isActive === null) return

  try {
    await integrationsStore.updateIntegrationStatus(integration.id)
    showSnackbar(
      isActive ? t('integrations.messages.activated') : t('integrations.messages.deactivated'),
      'success',
    )
  } catch (error) {
    console.error('Error updating status:', error)
    showSnackbar(t('integrations.messages.error'), 'error')
  }
}

const getIntegrationsList = async () => {
  try {
    await integrationsStore.getIntegrationsList()
  } catch (error) {
    console.error('Error loading integrations:', error)
    showSnackbar(t('integrations.messages.load_error'), 'error')
  }
}

onMounted(() => {
  getIntegrationsList()
})
</script>
