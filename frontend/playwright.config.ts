// frontend/playwright.config.ts
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
});
