<template>
  <v-row v-if="!hasResults && !isLoading">
    <v-col cols="12">
      <v-card
        elevation="1"
        class="pa-8 text-center"
      >
        <v-icon
          :icon="icon"
          size="64"
          class="mb-4"
          color="primary"
        />
        <h3 class="text-h6 mb-2">
          {{ title }}
        </h3>
        <p class="text-body-2 text-medium-emphasis mb-4">
          {{ description }}
        </p>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
interface Props {
  hasResults: boolean
  isLoading: boolean
  icon: string
  title: string
  description: string
}

defineProps<Props>()
</script>
