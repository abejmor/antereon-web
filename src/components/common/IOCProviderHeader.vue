<template>
  <v-row class="mb-6">
    <v-col cols="12">
      <div class="d-flex align-center mb-4">
        <v-icon
          :icon="icon"
          size="32"
          class="mr-3"
          color="primary"
        />
        <div>
          <h1 class="text-h4 font-weight-bold">
            {{ title }}
          </h1>
          <p class="text-subtitle-1 text-medium-emphasis mb-0">
            {{ description }}
          </p>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description: string
}

defineProps<Props>()
</script>
