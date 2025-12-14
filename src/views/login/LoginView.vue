<template>
  <v-container
    class="fill-height"
    data-testid="login-container"
    fluid
  >
    <v-row
      align="center"
      justify="center"
      data-testid="login-row"
    >
      <v-col
        cols="12"
        sm="8"
        md="6"
        lg="4"
        data-testid="login-col"
      >
        <v-alert
          v-if="show"
          :type="color"
          class="mb-4"
          data-testid="login-alert"
        >
          {{ message }}
        </v-alert>

        <v-card
          class="pa-4"
          elevation="4"
          rounded="lg"
          data-testid="login-card"
        >
          <v-card-title
            class="text-h5 text-center mb-4"
            data-testid="login-title"
          >
            {{ t('auth.login.title') }}
          </v-card-title>

          <v-form
            ref="form"
            data-testid="login-form"
            @submit.prevent="handleSubmit"
          >
            <v-text-field
              v-model="formData.email"
              :rules="[required, email]"
              :label="t('auth.login.email_label')"
              type="email"
              class="mb-4"
              data-testid="email-field"
              required
            />

            <v-text-field
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              :rules="[required]"
              :label="t('auth.login.password_label')"
              class="mb-4"
              data-testid="password-field"
              required
              @click:append-inner="showPassword = !showPassword"
            />

            <v-btn
              :loading="isLoading"
              type="submit"
              color="primary"
              size="large"
              class="mb-4"
              data-testid="submit-button"
              block
            >
              {{ t('auth.login.submit_button') }}
            </v-btn>
          </v-form>

          <v-divider
            class="my-4"
            data-testid="divider"
          />

          <div
            class="text-center"
            data-testid="register-section"
          >
            <p class="text-body-1">
              {{ t('auth.login.no_account') }}
              <router-link
                :to="{ name: 'register' }"
                class="text-primary text-decoration-none"
                data-testid="register-link"
              >
                {{ t('auth.login.register_link') }}
              </router-link>
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAlert } from '@/composables/useAlert'
import { useLoader } from '@/composables/useLoader'
import { useValidation } from '@/composables/useValidation'

import { useAuthStore } from '@/stores/authStore'

import { email, required } from '@/validators'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const { formRefs, isValidForm } = useValidation()
const { showAlert, message, color, show } = useAlert()
const { isLoading, startLoading, stopLoading } = useLoader()
const form = ref()

const formData = ref({
  email:    '',
  password: ''
})

const showPassword = ref(false)

const handleSubmit = async () => {
  try {
    formRefs.value = { form: form.value }
    const isValid = await isValidForm()

    if (!isValid) {
      return
    }

    startLoading()
    const { email, password } = formData.value
    await authStore.login(email, password)
    showAlert(t('auth.login.success'), 'success')
    router.push({ name: 'home' })
  } catch (error) {
    console.error('Login error:', error)
    showAlert(t('auth.login.error.generic'), 'error')
  } finally {
    stopLoading()
  }
}
</script>

<style scoped src="./LoginView.scss" lang="scss" />
