import { createApp } from 'vue'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import JsonViewer from 'vue3-json-viewer'
import 'vue3-json-viewer/dist/vue3-json-viewer.css'

import App from '@/App.vue'
import i18n from '@/plugins/i18n'
import vuetify from '@/plugins/vuetify'
import router from '@/router'
import '@/styles/main.scss'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(vuetify)
app.use(i18n)
app.use(JsonViewer)

app.mount('#app')
