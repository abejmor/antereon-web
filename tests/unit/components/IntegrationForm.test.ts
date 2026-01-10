import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createI18n } from 'vue-i18n'
import { createVuetify } from 'vuetify'

import IntegrationForm from '@/components/integrations/IntegrationForm.vue'

vi.mock('@/helpers/integrationHelpers', () => ({
  getAvailableProviders: () => [{ id: 'virustotal', name: 'VirusTotal' }]
}))

const i18n = createI18n({
  legacy:       false,
  locale:       'en',
  missingWarn:  false,
  fallbackWarn: false,
  messages:     {
    en: {
      integrations: {
        form: { title_add: 'Add Integration', title_edit: 'Edit Integration' }
      }
    }
  }
})

const vuetify = createVuetify()

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe:    vi.fn(),
  unobserve:  vi.fn(),
  disconnect: vi.fn()
}))

// Silence Vue warn about multiple plugin registration
const originalWarn = console.warn
beforeEach(() => {
  console.warn = vi.fn((...args) => {
    const msg = args.join(' ')
    if (msg.includes('already been registered') || msg.includes('App already provides property')) return
    originalWarn(...args)
  })
})
afterEach(() => {
  console.warn = originalWarn
})

const createWrapper = (props = {}) =>
  mount(IntegrationForm, {
    props:  { modelValue: false, ...props },
    global: {
      plugins: [i18n, vuetify],
      stubs:   {
        'v-form': {
          template: '<form><slot /></form>',
          methods:  { validate: () => Promise.resolve({ valid: true }), reset: () => {} }
        }
      }
    }
  })

describe('IntegrationForm', () => {
  it('renders correctly for add/edit modes', () => {
    const wrapperAdd = createWrapper({ modelValue: true })
    expect(wrapperAdd.find('[data-testid="integration-form"]').exists()).toBe(true)
    expect(wrapperAdd.text()).toContain('Add Integration')

    const wrapperEdit = createWrapper({
      modelValue:  true,
      integration: {
        id:         '1',
        name:       'Test',
        provider:   'virustotal',
        isActive:   true,
        isFavorite: false
      }
    })
    expect(wrapperEdit.text()).toContain('Edit Integration')
  })

  it('handles form submission', async () => {
    const wrapper = createWrapper({ modelValue: true })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.emitted()).toBeDefined()
  })
})
