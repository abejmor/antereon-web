<template>
  <v-sheet
    class="cta-section py-16"
    color="primary"
  >
    <v-container>
      <v-row justify="center">
        <v-col
          cols="12"
          md="8"
          class="text-center text-white"
        >
          <h2 class="text-h3 font-weight-bold mb-3">
            {{ t('landing.cta_section.title') }}
          </h2>
          <p class="text-body-1 mb-10">
            {{ t('landing.cta_section.description') }}
          </p>

          <div class="d-flex justify-center align-center flex-column">
            <v-btn
              :to="{ name: 'register' }"
              color="white"
              variant="elevated"
              size="x-large"
              class="text-primary px-8"
              rounded="pill"
            >
              {{ t('landing.cta_section.register_button') }}
              <v-icon end>
                mdi-account-plus
              </v-icon>
            </v-btn>
            <div class="mt-4 text-caption text-white opacity-75">
              {{ t('landing.cta_section.by_registering') }}
              <router-link
                :to="{ name: 'privacyPolicy' }"
                class="text-white text-decoration-underline mx-1"
              >
                {{ t('landing.cta_section.privacy_policy') }}
              </router-link>
            </div>
          </div>

          <v-divider class="my-12 border-opacity-25" />

          <div class="d-flex flex-column flex-md-row justify-space-around">
            <div class="mb-6 mb-md-0">
              <div class="text-h3 font-weight-bold mb-2">
                3+
              </div>
              <div class="text-subtitle-2">
                {{ t('landing.cta_section.metrics.services') }}
              </div>
            </div>
            <div class="mb-6 mb-md-0">
              <div class="text-h3 font-weight-bold mb-2">
                100%
              </div>
              <div class="text-subtitle-2">
                {{ t('landing.cta_section.metrics.byoa') }}
              </div>
            </div>
            <div>
              <div class="text-h3 font-weight-bold mb-2">
                AES-256-GCM
              </div>
              <div class="text-subtitle-2">
                {{ t('landing.cta_section.metrics.encryption') }}
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup lang="ts">
const { t } = useI18n()
</script>

<style lang="scss" src="./CtaSection.scss" scoped />
