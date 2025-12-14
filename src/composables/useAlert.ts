export const useAlert = () => {
  const show = ref(false)
  const message = ref('')
  const color = ref<'error' | 'success' | 'info' | 'warning'>('error')

  const showAlert = (msg: string, type: 'error' | 'success' | 'info' | 'warning' = 'error') => {
    message.value = msg
    color.value = type
    show.value = true
  }

  const hideAlert = () => {
    show.value = false
  }

  return {
    show,
    message,
    color,
    showAlert,
    hideAlert
  }
}

export const useSnackbar = () => {
  const snackbar = ref({
    show:    false,
    message: '',
    color:   'error'
  })

  const showSnackbar = (message: string, color: string = 'error') => {
    snackbar.value = {
      show: true,
      message,
      color
    }
  }

  const hideSnackbar = () => {
    snackbar.value.show = false
  }

  return {
    snackbar,
    showSnackbar,
    hideSnackbar
  }
}
