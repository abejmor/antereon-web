<template>
  <v-app>
    <TopBar />
    <SidebarMain />
    <v-main class="container hstack">
      <div class="content-container w-100 scroll">
        <router-view v-slot="{ Component }">
          <transition
            name="fade"
            mode="out-in"
          >
            <component
              v-if="Component"
              :is="Component"
            />
          </transition>
        </router-view>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { initializeTheme } = useTheme()

onMounted(() => {
  initializeTheme()
})
</script>
