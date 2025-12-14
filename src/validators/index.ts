import v8n from 'v8n'

import i18n from '@/plugins/i18n'
import {
  emailRegEx,
  passwordRegEx,
  urlRegEx
} from '@/validators/regExes'

declare module 'v8n' {

  interface V8nValidator {
    email(): this;
    password(): this;
    url(): this;
    required(): this;
    minLength(): this;
    maxLength(): this;
  }
}
const { t } = i18n.global

const notFilled = (v: any): boolean =>
  v == null || v === ''

v8n.extend({
  email:     () => (v: string) => v != null && v !== '' && emailRegEx.test(v),
  password:  () => (v: string) => notFilled(v) || passwordRegEx.test(v),
  url:       () => (v: string) => v != null && v !== '' && urlRegEx.test(v),
  required:  () => (v: any) => v != null && v !== '',
  minLength: (length: number) => (v: string) => notFilled(v) || v.length >= length,
  maxLength: (length: number) => (v: string) => notFilled(v) || v.length <= length
})

export const email = (v: string): true | string =>
  v8n().email().test(v) || t('validations.email')

export const password = (v: string): true | string =>
  v8n().password().test(v) || t('validations.password')

export const minLength = (length: number) => (v: string): true | string =>
  v8n().minLength(length).test(v) || t('validations.minLength', { length })

export const maxLength = (length: number) => (v: string): true | string =>
  v8n().maxLength(length).test(v) || t('validations.maxLength', { length })

export const url = (v: string): true | string =>
  v8n().url().test(v) || t('validations.invalid_url')

export const same = (valToCompare: string) =>
  (v: string): true | string =>
    v === valToCompare || t('validations.passwords_no_match')

export const required = (v: any): true | string =>
  (Array.isArray(v) ? true : typeof v === 'boolean' ? true : v8n().required().test(v)) || t('validations.required')
