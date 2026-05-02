import { test, expect } from '@playwright/test';

test.use({ storageState: { cookies: [], origins: [] } });

// Case 10
test('logout and login keeps authenticated data separated from logged-out state', async ({
  page,
}) => {
  const email = process.env.E2E_TEST_EMAIL;
  const password = process.env.E2E_TEST_PASSWORD;

  if (!email || !password) {
    throw new Error('Missing E2E_TEST_EMAIL or E2E_TEST_PASSWORD');
  }

  await page.goto('/');

  await page.evaluate(
    async ({ email, password }) => {
      const { supabase } = await import('../src/lib/supabaseClient');

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);
    },
    { email, password },
  );

  await page.reload();

  // Ensure we really are logged in before continuing
  await expect(page.getByRole('button', { name: /logout/i })).toBeVisible();

  const threadName = `Session separation ${Date.now()}`;

  // Step 1: create authenticated-only thread
  await page.getByTestId('add-thread-button').click();

  const newThreadInput = page.getByTestId('new-thread-input');
  await expect(newThreadInput).toBeVisible();
  await newThreadInput.fill(threadName);

  await page.getByTestId('confirm-add-thread').click();

  const authThread = page
    .getByTestId('thread-item')
    .filter({ hasText: threadName });

  await expect(authThread).toHaveCount(1);

  // ensure authenticated UI is stable before logging out:
  await expect(page.getByTestId('go-back-card')).toBeVisible();

  // Step 2: log out
  const logoutButton = page.getByRole('button', { name: /logout/i });
  await expect(logoutButton).toBeVisible();
  await logoutButton.click();

  // Step 3: authenticated thread should no longer be visible
  await expect(
    page.getByTestId('thread-item').filter({ hasText: threadName }),
  ).toHaveCount(0);

  // Step 4: logged-out/login state should be visible
  await expect(
    page.getByRole('button', { name: /continue with google/i }).first(),
  ).toBeVisible();

  // Step 5: log back in with the same user
  await page.evaluate(
    async ({ email, password }) => {
      const { supabase } = await import('../src/lib/supabaseClient');

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);
    },
    { email, password },
  );

  await page.reload();

  // Step 6: authenticated workspace is restored
  await expect(page.getByTestId('go-back-card')).toBeVisible();

  await expect(
    page.getByTestId('thread-item').filter({ hasText: threadName }),
  ).toHaveCount(1);
});
