<template>
  <v-container
    data-testid="register-container"
    class="fill-height"
    fluid
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="6"
        lg="4"
      >
        <v-alert
          v-if="show"
          :type="color"
          class="mb-4"
          data-testid="register-alert"
        >
          {{ message }}
        </v-alert>

        <v-card
          data-testid="register-card"
          class="pa-4"
          elevation="4"
          rounded="lg"
        >
          <v-card-title
            class="text-h5 text-center mb-4"
            data-testid="register-title"
          >
            {{ t('auth.register.title') }}
          </v-card-title>

          <v-form
            ref="form"
            data-testid="register-form"
            @submit.prevent="handleSubmit"
          >
            <v-text-field
              v-model="formData.name"
              :rules="[required]"
              :label="t('auth.register.name_label')"
              class="mb-4"
              data-testid="name-field"
              required
            />

            <v-text-field
              v-model="formData.email"
              :rules="[required, email]"
              :label="t('auth.register.email_label')"
              type="email"
              class="mb-4"
              data-testid="email-field"
              required
            />

            <v-text-field
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              :rules="[required, minLength(8), password]"
              :label="t('auth.register.password_label')"
              class="mb-4"
              data-testid="password-field"
              required
              @click:append-inner="showPassword = !showPassword"
            />

            <v-text-field
              v-model="formData.confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              :rules="[required, same(formData.password)]"
              :label="t('auth.register.confirm_password_label')"
              class="mb-4"
              data-testid="confirm-password-field"
              required
            />

            <v-btn
              :loading="isLoading"
              type="submit"
              color="primary"
              data-testid="submit-button"
              size="large"
              rounded="lg"
              block
            >
              {{ t('auth.register.submit_button') }}
            </v-btn>
          </v-form>

          <v-divider class="my-4" />

          <div class="text-center">
            <p class="text-body-1">
              {{ t('auth.register.already_have_account') }}
              <router-link
                :to="{ name: 'login' }"
                class="text-primary text-decoration-none"
                data-testid="login-link"
              >
                {{ t('auth.register.login_link') }}
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

import { email, required, same, minLength, password } from '@/validators'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const { formRefs, isValidForm } = useValidation()
const { showAlert, message, color, show } = useAlert()
const { isLoading, startLoading, stopLoading } = useLoader()
const form = ref()

const formData = ref({
  name:            '',
  email:           '',
  password:        '',
  confirmPassword: ''
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
    const { name, email, password } = formData.value
    await authStore.register(email, password, name)
    showAlert(t('auth.register.success'), 'success')
    router.push({ name: 'home' })
  } catch (error) {
    console.error('Registration error:', error)
    showAlert(t('auth.register.error.generic'), 'error')
  } finally {
    stopLoading()
  }
}
</script>

<style scoped src="./RegisterView.scss" />
