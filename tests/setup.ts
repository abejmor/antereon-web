import { config, RouterLinkStub } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import i18n from '@/plugins/i18n'

const vuetify = createVuetify({
  components,
  directives
})

config.global.plugins = [vuetify, i18n]
config.global.stubs = {
  'router-link': RouterLinkStub
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value:    vi.fn().mockImplementation(query => ({
    matches:             false,
    media:               query,
    onchange:            null,
    addListener:         vi.fn(),
    removeListener:      vi.fn(),
    addEventListener:    vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent:       vi.fn()
  }))
})

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  disconnect: vi.fn(),
  observe:    vi.fn(),
  unobserve:  vi.fn()
}))

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  disconnect: vi.fn(),
  observe:    vi.fn(),
  unobserve:  vi.fn()
}))
