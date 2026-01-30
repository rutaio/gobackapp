import { test, expect } from '@playwright/test';

test('GoBack app loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Go Back')).toBeVisible();
});

