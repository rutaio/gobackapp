import { test, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

test('save authenticated session', async ({ page }) => {
  const email = process.env.E2E_TEST_EMAIL;
  const password = process.env.E2E_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error('Missing E2E_TEST_EMAIL or E2E_TEST_PASSWORD');
  }

  await page.goto('/');

  await page.evaluate(
    async ({ email, password }) => {
      const { supabase } = await import('../src/lib/supabaseClient.ts');

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }
    },
    { email, password },
  );

  await page.reload();

  await expect(page.getByText(/logout/i)).toBeVisible();

  await page.context().storageState({
    path: authFile,
  });
});
