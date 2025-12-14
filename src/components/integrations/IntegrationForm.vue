<template>
  <v-form
    ref="formRef"
    v-model="isFormValid"
    data-testid="integration-form"
    @submit.prevent="handleSubmit"
  >
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span>{{ isEditing ? t('integrations.form.title_edit') : t('integrations.form.title_add') }}</span>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="$emit('cancel')"
        />
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="formData.name"
          :rules="nameRules"
          :label="t('integrations.form.name_label')"
          :placeholder="t('integrations.form.placeholder.name_placeholder')"
          class="mb-4"
          required
        />

        <v-select
          v-model="formData.provider"
          :items="providerOptions"
          :rules="providerRules"
          :disabled="isEditing"
          :label="t('integrations.form.provider_label')"
          :placeholder="t('integrations.form.placeholder.provider_placeholder')"
          item-title="name"
          item-value="id"
          class="mb-4"
          required
        >
          <template #item="{ props: itemProps, item }">
            <v-list-item v-bind="itemProps">
              <template #prepend>
                <v-avatar
                  :color="item.raw.color"
                  size="32"
                >
                  <v-icon
                    :icon="item.raw.icon"
                    color="white"
                    size="16"
                  />
                </v-avatar>
              </template>
              <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.raw.description }}</v-list-item-subtitle>
            </v-list-item>
          </template>

          <template #selection="{ item }">
            <div class="d-flex align-center">
              <v-avatar
                :color="item.raw.color"
                size="24"
                class="me-2"
              >
                <v-icon
                  :icon="item.raw.icon"
                  color="white"
                  size="12"
                />
              </v-avatar>
              {{ item.raw.name }}
            </div>
          </template>
        </v-select>

        <v-alert
          v-if="selectedProvider"
          type="info"
          variant="tonal"
          class="mb-4"
        >
          <div class="d-flex align-center">
            <v-avatar
              :color="selectedProvider.color"
              size="40"
              class="me-3"
            >
              <v-icon
                :icon="selectedProvider.icon"
                color="white"
              />
            </v-avatar>
            <div>
              <div class="font-weight-medium">
                {{ selectedProvider.name }}
              </div>
              <div class="text-caption">
                {{ selectedProvider.description }}
              </div>
              <a
                :href="selectedProvider.website"
                target="_blank"
                class="text-caption text-decoration-none"
              >
                {{ t('integrations.website') }}
                <v-icon
                  icon="mdi-open-in-new"
                  size="12"
                />
              </a>
            </div>
          </div>
        </v-alert>

        <v-switch
          v-model="formData.isActive"
          :label="t('integrations.form.active_label')"
          :hint="t('integrations.form.active_hint')"
          color="primary"
          class="mb-4"
          persistent-hint
        />

        <v-switch
          v-model="formData.isDefault"
          :disabled="!formData.isActive"
          :label="t('integrations.form.default_label')"
          :hint="formData.isActive ? t('integrations.form.default_hint') : t('integrations.form.default_hint_disabled')"
          color="primary"
          class="mb-4"
          persistent-hint
        />

        <div v-if="selectedProvider">
          <h3 class="text-h6 mb-3">
            {{ t('integrations.form.configuration') }}
          </h3>

          <div
            v-for="field in selectedProvider.fields"
            :key="field.key"
            class="mb-4"
          >
            <v-text-field
              :model-value="getFieldValue(field.key)"
              :label="field.label"
              :placeholder="field.placeholder"
              :type="field.type === 'password' && !showPasswords[field.key] ? 'password' : 'text'"
              :rules="getFieldRules(field)"
              :required="field.required"
              :hint="field.description"
              persistent-hint
              @update:model-value="setFieldValue(field.key, $event)"
            >
              <template #append-inner>
                <div class="d-flex align-center">
                  <v-btn
                    v-if="field.type === 'password'"
                    :icon="showPasswords[field.key] ? 'mdi-eye-off' : 'mdi-eye'"

                    variant="text"
                    size="small"
                    class="me-1"
                    @click="togglePasswordVisibility(field.key)"
                  />
                  <v-tooltip
                    v-if="field.description"
                    location="top"
                  >
                    <template #activator="{ props: tooltipProps }">
                      <v-icon
                        v-bind="tooltipProps"
                        icon="mdi-help-circle-outline"
                        size="16"
                      />
                    </template>
                    {{ field.description }}
                  </v-tooltip>
                </div>
              </template>
            </v-text-field>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="px-6 pb-6">
        <v-spacer />
        <v-btn
          variant="text"
          @click="$emit('cancel')"
        >
          {{ t('integrations.form.cancel_button') }}
        </v-btn>
        <v-btn
          :loading="loading"
          :disabled="!isFormValid || !selectedProvider"
          type="submit"
          color="primary"
        >
          {{ isEditing ? t('integrations.form.update_button') : t('integrations.form.create_button') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import type { Integration, CreateIntegrationRequest, UpdateIntegrationRequest } from '@/types/integration'

import { AVAILABLE_INTEGRATIONS, getIntegrationProvider } from '@/constants/integrations'
import { integrationsService } from '@/services/integrationsService'
import { required, minLength, maxLength, url } from '@/validators'

interface Props {
  integration?: Integration
  loading?: boolean
}

interface Emits {
  submit: [data: CreateIntegrationRequest | UpdateIntegrationRequest]
  cancel: []
}

const props = withDefaults(defineProps<Props>(), {
  integration: undefined,
  loading:     false
})

const emit = defineEmits<Emits>()

const { t } = useI18n()

const formRef = ref()
const isFormValid = ref(false)
const showPasswords = ref<Record<string, boolean>>({})
const realApiKey = ref<string>('')

const isEditing = computed(() => !!props.integration)
const providerOptions = computed(() => AVAILABLE_INTEGRATIONS)

const initializeFormData = () => {
  if (props.integration) {
    return {
      name:          props.integration.name || '',
      provider:      props.integration.provider || '',
      apiKey:        '••••••••••••••••',
      isActive:      props.integration.isActive ?? true,
      isDefault:     props.integration.isDefault ?? false,
      configuration: { ...props.integration.configuration }
    }
  }
  return {
    name:          '',
    provider:      '',
    apiKey:        '',
    isActive:      true,
    isDefault:     false,
    configuration: {}
  }
}

const formData = ref(initializeFormData())

const selectedProvider = computed(() => {
  if (!formData.value.provider) return null
  return getIntegrationProvider(formData.value.provider)
})

const nameRules = [
  required,
  minLength(3),
  maxLength(50)
]

const providerRules = [
  required
]

const getFieldRules = (field: any) => {
  const rules = []

  if (field.required) {
    rules.push(required)
  }

  if (field.type === 'url') {
    rules.push(url)
  }

  return rules
}

const getFieldValue = (fieldKey: string): string => {
  if (fieldKey === 'api_key') {
    if (showPasswords.value[fieldKey] && realApiKey.value !== '') {
      return realApiKey.value
    }
    return formData.value.apiKey || ''
  }
  return formData.value.configuration[fieldKey] || ''
}

const setFieldValue = (fieldKey: string, value: string) => {
  if (fieldKey === 'api_key') {
    if (value !== '••••••••••••••••') {
      formData.value.apiKey = value
      realApiKey.value = value
    }
  } else {
    formData.value.configuration[fieldKey] = value
  }
}

const buildUpdateData = (): UpdateIntegrationRequest => {
  const updateData: UpdateIntegrationRequest = {}
  const { integration } = props

  if (formData.value.name !== integration?.name) {
    updateData.name = formData.value.name
  }

  if (formData.value.isActive !== integration?.isActive) {
    updateData.isActive = formData.value.isActive
  }

  if (formData.value.isDefault !== integration?.isDefault) {
    updateData.isDefault = formData.value.isDefault
  }

  const newConfiguration = {
    ...formData.value.configuration
  }

  if (formData.value.apiKey && formData.value.apiKey !== '••••••••••••••••') {
    newConfiguration.api_key = formData.value.apiKey
  } else if (integration?.configuration?.api_key) {
    newConfiguration.api_key = integration.configuration.api_key
  }

  if (JSON.stringify(newConfiguration) !== JSON.stringify(integration?.configuration)) {
    updateData.configuration = newConfiguration
  }

  return updateData
}

const buildCreateData = (): CreateIntegrationRequest => ({
  name:          formData.value.name,
  provider:      formData.value.provider,
  apiKey:        formData.value.apiKey || '',
  isDefault:     formData.value.isDefault,
  configuration: {
    ...formData.value.configuration,
    api_key: formData.value.apiKey || ''
  }
})

const togglePasswordVisibility = async (fieldKey: string) => {
  if (fieldKey === 'api_key' && isEditing.value && !showPasswords.value[fieldKey]) {
    try {
      if (props.integration?.id) {
        const decryptedData = await integrationsService.getDecryptedApiKey(props.integration.id)
        realApiKey.value = decryptedData.apiKey
      } else {
        realApiKey.value = '••••••••••••••••'
      }
    } catch (error) {
      console.error('error getting decrypted API key:', error)
      realApiKey.value = '••••••••••••••••'
    }
  }

  showPasswords.value[fieldKey] = !showPasswords.value[fieldKey]
}

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()

  if (!valid || !selectedProvider.value) return

  const submitData = isEditing.value ? buildUpdateData() : buildCreateData()
  emit('submit', submitData)
}

watch(() => props.integration, () => {
  formData.value = initializeFormData()
}, { immediate: false })

watch(() => formData.value.isActive, (newValue) => {
  if (!newValue && formData.value.isDefault) {
    formData.value.isDefault = false
  }
})
</script>
