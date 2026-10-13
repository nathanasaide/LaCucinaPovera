import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  use: {
    baseURL: 'http://127.0.0.1:4322',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'schedule', testMatch: 'openStatus.spec.ts' },
    {
      name: 'chromium',
      testMatch: 'site.spec.ts',
      use: { ...devices['Desktop Chrome'], timezoneId: 'America/New_York' },
    },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4322',
    url: 'http://127.0.0.1:4322',
    reuseExistingServer: false,
  },
});
