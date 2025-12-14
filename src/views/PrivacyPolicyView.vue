<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col
        cols="12"
        md="8"
        lg="6"
      >
        <v-card
          class="pa-6"
          elevation="2"
          rounded="lg"
        >
          <v-card-title class="d-flex align-center justify-space-between pa-4">
            <div class="d-flex align-center">
              <v-icon
                class="mr-3"
                color="primary"
                size="28"
              >
                mdi-shield-account
              </v-icon>
              <h1 class="text-h4 font-weight-bold">
                {{ t('privacy_policy.title') }}
              </h1>
            </div>
            <v-btn
              color="primary"
              variant="outlined"
              size="small"
              to="/"
              prepend-icon="mdi-home"
            >
              {{ t('common.back_to_home') }}
            </v-btn>
          </v-card-title>

          <v-card-text class="pa-4">
            <p class="text-body-2 text-medium-emphasis mb-6">
              {{ t('privacy_policy.last_updated') }}
            </p>

            <v-divider class="mb-8" />

            <section class="mb-10">
              <h2 class="text-h5 font-weight-bold mb-4">
                {{ t('privacy_policy.introduction.title') }}
              </h2>
              <p class="text-body-1">
                {{ t('privacy_policy.introduction.content') }}
              </p>
            </section>

            <section class="mb-10">
              <h2 class="text-h5 font-weight-bold mb-4">
                {{ t('privacy_policy.data_collection.title') }}
              </h2>
              <p class="text-body-1">
                {{ t('privacy_policy.data_collection.content') }}
              </p>
            </section>

            <section class="mb-10">
              <h2 class="text-h5 font-weight-bold mb-4">
                {{ t('privacy_policy.data_usage.title') }}
              </h2>
              <p class="text-body-1">
                {{ t('privacy_policy.data_usage.content') }}
              </p>
            </section>

            <section class="mb-10">
              <h2 class="text-h5 font-weight-bold mb-4">
                {{ t('privacy_policy.data_storage.title') }}
              </h2>
              <p class="text-body-1">
                {{ t('privacy_policy.data_storage.content') }}
              </p>
            </section>

            <section class="mb-10">
              <h2 class="text-h5 font-weight-bold mb-4">
                {{ t('privacy_policy.your_rights.title') }}
              </h2>
              <p class="text-body-1">
                {{ t('privacy_policy.your_rights.content') }}
              </p>
            </section>

            <section class="mb-10">
              <h2 class="text-h5 font-weight-bold mb-4">
                {{ t('privacy_policy.contact.title') }}
              </h2>
              <p class="text-body-1">
                {{ t('privacy_policy.contact.content') }}
              </p>
            </section>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>
