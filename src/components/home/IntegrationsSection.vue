<template>
  <v-row class="mt-8">
    <v-col cols="12">
      <v-card elevation="4">
        <v-card-title class="d-flex align-center justify-space-between pa-4">
          <div class="d-flex align-center">
            <v-icon
              icon="mdi-puzzle"
              class="me-3"
            />
            {{ t('home.integrations.title') }}
          </div>
          <v-btn
            :to="{ name: 'integrations' }"
            variant="text"
            size="small"
            append-icon="mdi-arrow-right"
          >
            {{ t('home.integrations.view_all') }}
          </v-btn>
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
              {{ t('home.integrations.loading') }}
            </p>
          </div>
          <v-row
            v-else-if="integrations.length > 0"
            class="gy-4"
          >
            <v-col
              v-for="integration in displayedIntegrations"
              :key="integration.id"
              cols="12"
              sm="6"
              lg="4"
            >
              <IntegrationCard
                :integration="integration"
                clickable
                @click="navigateToIntegrations"
              />
            </v-col>
          </v-row>
          <div
            v-else
            class="text-center py-8"
          >
            <v-icon
              icon="mdi-puzzle-outline"
              size="48"
              color="grey-lighten-1"
              class="mb-4"
            />
            <h4 class="text-h6 mb-3">
              {{ t('home.integrations.no_integrations') }}
            </h4>
            <p class="text-body-2 text-medium-emphasis mb-4">
              {{ t('home.integrations.no_integrations_description') }}
            </p>
            <v-btn
              :to="{ name: 'integrations' }"
              color="primary"
              prepend-icon="mdi-plus"
            >
              {{ t('home.integrations.add_first') }}
            </v-btn>
          </div>
          <div
            v-if="integrations.length > maxDisplayed"
            class="text-center mt-4"
          >
            <v-btn
              :to="{ name: 'integrations' }"
              variant="outlined"
              color="primary"
            >
              {{ t('home.integrations.view_all_count', { count: integrations.length }) }}
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useIntegrationsStore } from '@/stores/integrations'

const { t } = useI18n()
const router = useRouter()
const integrationsStore = useIntegrationsStore()

const loading = computed(() => integrationsStore.loading)
const integrations = computed(() => integrationsStore.integrationsList)

const maxDisplayed = 6

const displayedIntegrations = computed(() => {
  return integrations.value.slice(0, maxDisplayed)
})

const navigateToIntegrations = () => {
  router.push({ name: 'integrations' })
}

onMounted(() => {
  if (integrationsStore.integrationsList.length === 0) {
    integrationsStore.getIntegrationsList()
  }
})
</script>
