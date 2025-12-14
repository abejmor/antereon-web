import { createI18n } from 'vue-i18n'

import en from '../../locales/en.json'

const messages = { en: { ...en } }

const locale = 'en'

const i18n = createI18n({
  legacy: false,
  locale: locale,
  messages
})

export default i18n
