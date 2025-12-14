<template>
  <v-sheet
    class="py-16 position-relative"
    color="background"
  >
    <div class="section-separator" />

    <v-container>
      <v-row
        justify="center"
        class="mb-10"
      >
        <v-col
          cols="12"
          md="8"
          class="text-center"
        >
          <h2 class="text-h3 font-weight-bold mb-3 text-white">
            {{ t('landing.how_works_section.title') }}
          </h2>
          <p class="text-body-1 text-white">
            {{ t('landing.how_works_section.description') }}
          </p>
        </v-col>
      </v-row>

      <v-row class="mt-6">
        <v-col
          v-for="(step, i) in steps"
          :key="i"
          cols="12"
          sm="6"
          md="3"
        >
          <v-card
            height="100%"
            min-height="260"
            class="d-flex flex-column pa-6 position-relative"
            color="surface"
            elevation="4"
            rounded="lg"
          >
            <div>
              {{ i + 1 }}
            </div>

            <div class="d-flex justify-center mb-4">
              <v-avatar
                :color="step.color"
                size="64"
                class="elevation-2"
              >
                <v-icon
                  size="36"
                  color="white"
                >
                  {{ step.icon }}
                </v-icon>
              </v-avatar>
            </div>

            <h3 class="text-h6 font-weight-bold text-white text-center mb-3">
              {{ t(`landing.how_works_section.steps.${step.key}.title`) }}
            </h3>

            <p class="text-body-2 text-white text-center">
              {{ t(`landing.how_works_section.steps.${step.key}.content`) }}
            </p>
          </v-card>
        </v-col>
      </v-row>

      <v-row
        justify="center"
        class="mt-12"
      >
        <v-col
          cols="12"
          md="6"
          class="text-center"
        >
          <v-btn
            color="primary"
            size="large"
            rounded="pill"
            class="px-8 text-white"
            variant="elevated"
            to="/register"
          >
            {{ t('landing.how_works_section.cta_button') }}
            <v-icon end>
              mdi-shield-search
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup lang="ts">
const { t } = useI18n()

const steps = [
  {
    key:   'register',
    icon:  'mdi-account-plus',
    color: 'primary'
  },
  {
    key:   'add_api_keys',
    icon:  'mdi-key',
    color: 'secondary'
  },
  {
    key:   'submit_iocs',
    icon:  'mdi-magnify',
    color: 'info'
  },
  {
    key:   'analyze_results',
    icon:  'mdi-chart-bar',
    color: 'success'
  }
]
</script>

<style lang="scss" src="./HowWorks.scss" scoped />
