<template>
  <div
    class="profile-view view-container"
    data-testid="profile-view"
  >
    <h1
      class="text-h4 font-weight-bold mb-6"
      data-testid="page-title"
    >
      {{ t('profile.title') }}
    </h1>
    <v-card
      class="mb-6"
      elevation="2"
      data-testid="profile-form-card"
    >
      <v-card-title
        class="text-h6"
        data-testid="profile-form-title"
      >
        {{ t('profile.edit_profile.title') }}
      </v-card-title>
      <v-card-text>
        <v-form
          ref="profileForm"
          data-testid="profile-form"
          @submit.prevent="updateProfile"
        >
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="profileData.name"
                :label="t('profile.edit_profile.name')"
                :rules="[required]"
                :loading="isLoading"
                data-testid="name-input"
                variant="outlined"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="profileData.email"
                :label="t('profile.edit_profile.email')"
                :rules="[required, email]"
                :loading="isLoading"
                data-testid="email-input"
                variant="outlined"
                type="email"
                required
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-select
                v-model="profileData.theme"
                :label="t('profile.theme.selector_label')"
                :items="availableThemes"
                item-title="name"
                item-value="key"
                variant="outlined"
                data-testid="theme-select"
              >
                <template #item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-icon
                        :icon="item.raw.icon"
                        class="me-3"
                      />
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-btn
                :loading="isLoading"
                :disabled="false"
                color="primary"
                size="large"
                type="submit"
                data-testid="save-profile-btn"
              >
                {{ t('profile.edit_profile.save_button') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card
      class="mb-6"
      elevation="2"
      data-testid="password-form-card"
    >
      <v-card-title
        class="text-h6"
        data-testid="password-form-title"
      >
        {{ t('profile.change_password.title') }}
      </v-card-title>
      <v-card-text>
        <v-form
          ref="passwordForm"
          data-testid="password-form"
          @submit.prevent="changePassword"
        >
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="passwordData.currentPassword"
                :label="t('profile.change_password.current_password')"
                :rules="getPasswordValidationRules().currentPasswordRules"
                :loading="isLoading"
                data-testid="current-password-input"
                variant="outlined"
                type="password"
                required
              />
            </v-col>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="passwordData.newPassword"
                :label="t('profile.change_password.new_password')"
                :rules="getPasswordValidationRules().newPasswordRules"
                :loading="isLoading"
                data-testid="new-password-input"
                variant="outlined"
                type="password"
                required
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="passwordData.confirmPassword"
                :label="t('profile.change_password.confirm_password')"
                :rules="getPasswordValidationRules().confirmPasswordRules"
                :loading="passwordLoading"
                data-testid="confirm-password-input"
                variant="outlined"
                type="password"
                required
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-btn
                :loading="passwordLoading"
                :disabled="false"
                data-testid="save-password-btn"
                color="primary"
                size="large"
                type="submit"
              >
                {{ t('profile.change_password.save_button') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      data-testid="snackbar"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { useSnackbar } from '@/composables/useAlert'
import { useLoader } from '@/composables/useLoader'
import { useTheme } from '@/composables/useTheme'
import { useValidation } from '@/composables/useValidation'

import { useAuthStore } from '@/stores/authStore'

import { profileService } from '@/services/profileService'
import { required, email, password, minLength, same } from '@/validators'

const { t } = useI18n()
const authStore = useAuthStore()
const { isLoading, startLoading, stopLoading } = useLoader()
const { formRefs } = useValidation()
const { showSnackbar, snackbar } = useSnackbar()
const { availableThemes, setTheme } = useTheme()

const profileForm = ref()
const passwordForm = ref()

const profileData = ref({
  name:  '',
  email: '',
  theme: 'antereonDark'
})

const passwordData = ref({
  currentPassword: '',
  newPassword:     '',
  confirmPassword: ''
})

const passwordLoading = ref(false)

const getPasswordValidationRules = () => {
  const hasPasswordContent = !!(passwordData.value.currentPassword || passwordData.value.newPassword || passwordData.value.confirmPassword)
  return {
    currentPasswordRules: hasPasswordContent ? [required] : [],
    newPasswordRules:     hasPasswordContent ? [required, password, minLength(8)] : [],
    confirmPasswordRules: hasPasswordContent ? [required, same(passwordData.value.newPassword)] : []
  }
}

const updateProfile = async () => {
  formRefs.value.profileForm = profileForm.value

  const isValid = await formRefs.value.profileForm?.validate()
  if (!isValid?.valid) return

  startLoading()

  try {
    const updatedUser = await profileService.updateProfile({
      name:  profileData.value.name,
      email: profileData.value.email,
      theme: profileData.value.theme
    })
    authStore.user = updatedUser
    if (updatedUser.theme) {
      setTheme(updatedUser.theme)
    }

    showSnackbar(t('profile.edit_profile.success_message'), 'success')
  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : t('profile.edit_profile.error_message')
    showSnackbar(errorMessage, 'error')
  } finally {
    stopLoading()
  }
}

const changePassword = async () => {
  formRefs.value.passwordForm = passwordForm.value

  const isValid = await formRefs.value.passwordForm?.validate()
  if (!isValid?.valid) return

  passwordLoading.value = true

  try {
    await profileService.changePassword({
      currentPassword: passwordData.value.currentPassword,
      newPassword:     passwordData.value.newPassword
    })
    passwordData.value = {
      currentPassword: '',
      newPassword:     '',
      confirmPassword: ''
    }

    showSnackbar(t('profile.change_password.success_message'), 'success')
  } catch (error: Error | unknown) {
    const errorMessage = error instanceof Error ? error.message : t('profile.change_password.error_message')
    showSnackbar(errorMessage, 'error')
  } finally {
    stopLoading()
  }
}

onMounted(() => {
  if (authStore.user) {
    profileData.value = {
      name:  authStore.user.name,
      email: authStore.user.email,
      theme: authStore.user.theme || 'antereonDark'
    }
  }
})
</script>
