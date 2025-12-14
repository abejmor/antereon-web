import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern:       'tests/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl:           'http://localhost:5173',
    screenshotsFolder: 'tests/e2e/screenshots',
    videosFolder:      'tests/e2e/videos',
    supportFile:       'tests/e2e/support/e2e.ts',
    fixturesFolder:    'tests/e2e/fixtures'
  }
})
