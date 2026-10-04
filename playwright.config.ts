import { defineConfig } from '@playwright/test';

export default defineConfig({ testDir: './tests', testMatch: '**/*.spec.ts', timeout: 120000, workers: 1, use: { baseURL: process.env.BOOKSANE_TEST_URL || 'http://localhost:3101', viewport: { width: 1440, height: 1000 }, launchOptions: { executablePath: process.env.BOOKSANE_TEST_BROWSER }, screenshot: 'only-on-failure', trace: 'retain-on-failure' }, reporter: 'list' });
