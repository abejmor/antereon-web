import stylistic from '@stylistic/eslint-plugin'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import eslintPluginImport from 'eslint-plugin-import'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default [
  ...pluginVue.configs['flat/recommended'],
  {
    files:           ['*.js', '*.ts', '**/*.js', '**/*.ts', '*.vue', '**/*.vue'],
    languageOptions: {
      parser:        vueParser,
      parserOptions: {
        parser:      tsParser,
        ecmaVersion: 2020,
        sourceType:  'module'
      },
      globals: {
        es6:                         true,
        browser:                     true,
        node:                        true,
        'vue/setup-compiler-macros': true
      }
    },
    plugins: {
      vue:                  pluginVue,
      '@typescript-eslint': typescriptEslint,
      import:               eslintPluginImport,
      '@stylistic':         stylistic
    },
    rules: {
      'generator-star-spacing':                    'off',
      'dot-location':                              ['error', 'property'],
      semi:                                        ['error', 'never'],
      indent:                                      ['error', 2, { SwitchCase: 1 }],
      'linebreak-style':                           ['error', 'unix'],
      quotes:                                      [2, 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      'quote-props':                               ['error', 'as-needed'],
      'no-unused-vars':                            'off',
      'brace-style':                               ['error'],
      'keyword-spacing':                           ['error'],
      'no-trailing-spaces':                        'error',
      'space-before-function-paren':               ['error', { anonymous: 'never', named: 'never', asyncArrow: 'always' }],
      'space-before-blocks':                       ['error', { functions: 'always', keywords: 'always', classes: 'always' }],
      'object-curly-spacing':                      ['error', 'always', { arraysInObjects: true }],
      'array-bracket-spacing':                     ['error', 'never'],
      'key-spacing':                               ['error', { beforeColon: false, afterColon: true, align: 'value' }],
      'comma-spacing':                             ['error', { before: false, after: true }],
      'comma-dangle':                              ['error', 'never'],
      'no-multiple-empty-lines':                   [2, { max: 1, maxEOF: 0, maxBOF: 0 }],
      'eol-last':                                  ['error', 'always'],
      'vue/max-attributes-per-line':               [2, { singleline: { max: 1 }, multiline: { max: 1 } }],
      'vue/attributes-order':                      ['error', { order: ['CONDITIONALS', 'LIST_RENDERING', 'GLOBAL', 'UNIQUE', 'TWO_WAY_BINDING', 'ATTR_DYNAMIC', 'CONTENT', 'ATTR_STATIC', 'ATTR_SHORTHAND_BOOL', 'EVENTS'] }],
      'vue/block-order':                           ['error', { order: ['template', 'script', 'style'] }],
      'vue/padding-line-between-blocks':           'error',
      'no-console':                                'off',
      'no-debugger':                               'off',
      'vue/no-v-html':                             'off',
      '@typescript-eslint/prefer-ts-expect-error': 'off',
      '@typescript-eslint/no-unused-vars':         'off',
      '@stylistic/type-annotation-spacing':        ['error', { before: false, after: true }],
      'import/order':                              ['error', {
        groups:     ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'object', 'type'],
        pathGroups: [
          { pattern: 'vue', group: 'builtin', position: 'before' },
          { pattern: 'vue-router', group: 'builtin', position: 'after' },
          { pattern: '@/**/composables/**', group: 'internal', position: 'before' },
          { pattern: '@/composables/**', group: 'internal', position: 'before' },
          { pattern: '@/**/stores/**', group: 'internal', position: 'before' },
          { pattern: '@/stores/**', group: 'internal', position: 'before' },
          { pattern: '@/**/components/**', group: 'internal', position: 'after' },
          { pattern: '@/components/**', group: 'internal', position: 'after' }
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between':            'always',
        alphabetize:                   { order: 'asc', caseInsensitive: true }
      }],
      'func-style': 'off'
    },
    ignores: [
      'dist',
      'node_modules',
      'public',
      'package.json',
      'components.d.ts',
      'auto-imports.d.ts'
    ]
  }
]
