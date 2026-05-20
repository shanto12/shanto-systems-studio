import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4189'
const isExternalTarget = Boolean(process.env.PLAYWRIGHT_BASE_URL)

export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results',
  timeout: 120000,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  webServer: isExternalTarget
    ? undefined
    : {
        command: 'npm run build && npm run preview -- --host 127.0.0.1 --port 4189',
        port: 4189,
        reuseExistingServer: false,
      },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1505, height: 1045 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'narrow',
      use: { ...devices['Desktop Chrome'], viewport: { width: 320, height: 900 } },
    },
  ],
})
