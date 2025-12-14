import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify, type ThemeDefinition } from 'vuetify'

const antereonDark: ThemeDefinition = {
  dark:   true,
  colors: {
    background: '#121212',
    surface:    '#1E1E1E',
    primary:    '#2D4A3D',
    secondary:  '#4CAF50',
    error:      '#F44336',
    info:       '#2196F3',
    warning:    '#FB8C00'
  }
}

const antereonLight: ThemeDefinition = {
  dark:   false,
  colors: {
    background: '#FFFFFF',
    surface:    '#F5F5F5',
    primary:    '#2D4A3D',
    secondary:  '#4CAF50',
    error:      '#F44336',
    info:       '#2196F3',
    warning:    '#FB8C00'
  }
}

export default createVuetify({
  theme: {
    defaultTheme: 'antereonDark',
    themes:       {
      antereonDark,
      antereonLight
    }
  },
  icons: {
    defaultSet: 'mdi'
  }
})
