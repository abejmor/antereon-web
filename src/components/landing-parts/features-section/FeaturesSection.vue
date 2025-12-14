<template>
  <v-sheet
    class="py-16"
    color="background"
  >
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
            {{ t('landing.features_section.title') }}
          </h2>
          <p class="text-body-1 text-white">
            {{ t('landing.features_section.description') }}
          </p>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="(service, index) in services"
          :key="index"
          cols="12"
          md="4"
          class="mb-6"
        >
          <v-card
            height="100%"
            class="pa-5 d-flex flex-column"
            elevation="3"
            rounded="lg"
            color="surface"
          >
            <div class="d-flex align-center mb-4">
              <v-avatar
                :color="service.color"
                size="48"
                class="me-4"
              >
                <v-icon
                  size="24"
                  color="white"
                >
                  {{ service.icon }}
                </v-icon>
              </v-avatar>
              <h3 class="text-h6 font-weight-bold text-white">
                {{ t(`landing.features_section.${service.translationKey}.title`) }}
              </h3>
            </div>
            <p class="text-body-1 mb-4 flex-grow-1 text-white">
              {{ t(`landing.features_section.${service.translationKey}.description`) }}
            </p>
            <v-chip-group
              class="flex-wrap"
              column
            >
              <v-chip
                v-for="(_feature, i) in service.features"
                :key="i"
                size="small"
                color="primary"
                variant="outlined"
                class="me-1 mb-1"
                disabled
              >
                {{ t(`landing.features_section.${service.translationKey}.features.${i}`) }}
              </v-chip>
            </v-chip-group>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>

<script setup lang="ts">
const { t } = useI18n()

const services = [
  {
    translationKey: 'virus_total',
    icon:           'mdi-virus',
    color:          'primary',
    features:       ['security_engines', 'reputation', 'whois']
  },
  {
    translationKey: 'abuse_ipdb',
    icon:           'mdi-shield-alert',
    color:          'error',
    features:       ['abuse_score', 'country', 'isp', 'detailed_reports']
  },
  {
    translationKey: 'alienvault_otx',
    icon:           'mdi-alien',
    color:          'warning',
    features:       ['threat_pulses', 'geolocation', 'asn', 'whitelist']
  }
]
</script>
