<template>
  <v-app-bar
    color="surface"
    flat
  >
    <v-btn
      icon
      @click="toggleSidebar"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-spacer />
    <v-btn
      @click="goHome"
    >
      <v-img
        :src="logo"
        width="35"
      />
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useSidebar } from '@/composables/useSidebar'

import logo from '@/assets/logo.png'

const router = useRouter()
const { toggleSidebar } = useSidebar()

const goHome = () => {
  router.push({ name: 'home' })
}
</script>
