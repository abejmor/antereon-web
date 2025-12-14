<template>
  <v-card
    elevation="2"
    class="pa-4"
  >
    <v-card-title class="text-h6 pa-0 mb-3">
      <v-icon
        icon="mdi-lightning-bolt"
        class="mr-2"
      />
      {{ t('common.quick_actions') }}
    </v-card-title>

    <div class="d-flex flex-column ga-2">
      <v-btn
        :disabled="!hasResults"
        variant="outlined"
        size="small"
        @click="$emit('export')"
      >
        <v-icon
          icon="mdi-download"
          class="mr-2"
        />
        {{ t('common.export_results') }}
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  hasResults: boolean
}

interface Emits {
  export: []
}

defineProps<Props>()
defineEmits<Emits>()

const { t } = useI18n()
</script>
