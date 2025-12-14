<template>
  <div>
    <h4 class="text-h6 mb-3 text-center">
      {{ title }}
    </h4>
    <div class="d-flex justify-center flex-wrap ga-2">
      <v-chip
        v-for="iocType in ['ip', 'domain', 'hash', 'url']"
        :key="iocType"
        :color="getSupportedIOCTypes(provider).includes(iocType) ? 'success' : undefined"
        :disabled="!getSupportedIOCTypes(provider).includes(iocType)"
        size="small"
        variant="tonal"
      >
        <v-icon
          :icon="getIOCTypeIcon(iocType)"
          class="mr-1"
          size="16"
        />
        <span v-if="!getSupportedIOCTypes(provider).includes(iocType)">
          {{ t('common.not_supported') }}:
        </span>
        {{ getIOCTypeLabel(iocType, t) }}
      </v-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getIOCTypeLabel, getSupportedIOCTypes, getIOCTypeIcon } from '@/helpers/iocHelpers'

interface Props {
  provider: string
  title: string
}

defineProps<Props>()

const { t } = useI18n()
</script>
