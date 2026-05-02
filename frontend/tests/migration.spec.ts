import { test, expect } from '@playwright/test';

// IMPORTANT: These tests need fresh users. Run them only after resetting/recreating the relevant Supabase users.

// Case 7: to be added in future

// Case 8:
test.describe('guest to auth migration', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('guest sample/local data is correctly imported when user authenticates', async ({
    page,
  }) => {
    const migrationEmail = process.env.E2E_MIGRATION_EMAIL;
    const migrationPassword = process.env.E2E_MIGRATION_PASSWORD;

    if (!migrationEmail || !migrationPassword) {
      throw new Error('Missing E2E_MIGRATION_EMAIL or E2E_MIGRATION_PASSWORD');
    }

    await page.goto('/');

    const guestThreadName = `Guest import ${Date.now()}`;
    const guestCheckinTitle = `Guest checkin ${Date.now()}`;

    // Step 1: create guest thread
    const addThreadButton = page.getByTestId('add-thread-button');
    await expect(addThreadButton).toBeVisible();
    await addThreadButton.click();

    const newThreadInput = page.getByTestId('new-thread-input');
    await expect(newThreadInput).toBeVisible();
    await newThreadInput.fill(guestThreadName);

    const confirmAddButton = page.getByTestId('confirm-add-thread');
    await expect(confirmAddButton).toBeEnabled();
    await confirmAddButton.click();

    await expect(
      page.getByTestId('thread-item').filter({ hasText: guestThreadName }),
    ).toBeVisible();

    // Step 2: add guest checkin into that guest thread
    const checkinTitleInput = page.getByTestId('checkin-title-input');
    await expect(checkinTitleInput).toBeVisible();
    await checkinTitleInput.fill(guestCheckinTitle);

    const saveCheckinButton = page.getByTestId('save-checkin-button');
    await expect(saveCheckinButton).toBeEnabled();
    await saveCheckinButton.click();

    await expect(page.getByTestId('checkins-history')).toContainText(
      guestCheckinTitle,
    );

    // Step 3: authenticate with fresh migration user
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
      { email: migrationEmail, password: migrationPassword },
    );

    // Reload so authenticated workspace bootstraps cleanly
    await page.reload();

    // Step 4: confirm guest-created thread now appears in authenticated workspace
    await expect(page.getByTestId('go-back-card')).toBeVisible();

    await expect(
      page.getByTestId('thread-item').filter({ hasText: guestThreadName }),
    ).toBeVisible();

    // Step 5: confirm imported checkin appears too
    await expect(page.getByTestId('checkins-history')).toContainText(
      guestCheckinTitle,
    );

    // Step 6: refresh and confirm imported data still persists
    await page.reload();

    await expect(
      page.getByTestId('thread-item').filter({ hasText: guestThreadName }),
    ).toBeVisible();

    await expect(page.getByTestId('checkins-history')).toContainText(
      guestCheckinTitle,
    );
  });
});

// Case 9:
test.describe('guest to auth dedupe', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('guest data is not imported multiple times on repeated login with the same user', async ({
    page,
  }) => {
    const dedupeEmail = process.env.E2E_DEDUPE_EMAIL;
    const dedupePassword = process.env.E2E_DEDUPE_PASSWORD;

    if (!dedupeEmail || !dedupePassword) {
      throw new Error('Missing E2E_DEDUPE_EMAIL or E2E_DEDUPE_PASSWORD');
    }

    await page.goto('/');

    const timestamp = Date.now();
    const guestThreadName = `Guest dedupe ${timestamp}`;
    const guestCheckinTitle = `Guest dedupe checkin ${timestamp}`;

    // Step 1: create guest thread
    await page.getByTestId('add-thread-button').click();

    const newThreadInput = page.getByTestId('new-thread-input');
    await expect(newThreadInput).toBeVisible();
    await newThreadInput.fill(guestThreadName);

    await page.getByTestId('confirm-add-thread').click();

    const guestThread = page
      .getByTestId('thread-item')
      .filter({ hasText: guestThreadName });

    await expect(guestThread).toHaveCount(1);

    // Step 2: create guest checkin
    const checkinInput = page.getByTestId('checkin-title-input');
    await expect(checkinInput).toBeVisible();
    await checkinInput.fill(guestCheckinTitle);

    await page.getByTestId('save-checkin-button').click();

    await expect(page.getByTestId('checkins-history')).toContainText(
      guestCheckinTitle,
    );

    // Step 3: first login with fresh dedupe user
    await page.evaluate(
      async ({ email, password }) => {
        const { supabase } = await import('../src/lib/supabaseClient');

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw new Error(error.message);
      },
      { email: dedupeEmail, password: dedupePassword },
    );

    await page.reload();

    // Step 4: wait for authenticated workspace to load
    await expect(page.getByTestId('go-back-card')).toBeVisible();
    await expect(page.getByTestId('thread-item').first()).toBeVisible();

    // Step 5: confirm imported thread exists once after first login
    const importedThreadAfterFirstLogin = page
      .getByTestId('thread-item')
      .filter({ hasText: guestThreadName });

    await expect(importedThreadAfterFirstLogin).toHaveCount(1);

    // Confirm imported checkin is visible after first login
    await expect(page.getByTestId('checkins-history')).toContainText(
      guestCheckinTitle,
    );

    // Step 6: log out
    await page.getByRole('button', { name: /logout/i }).click();

    // Step 7: log in again with same user
    await page.evaluate(
      async ({ email, password }) => {
        const { supabase } = await import('../src/lib/supabaseClient');

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw new Error(error.message);
      },
      { email: dedupeEmail, password: dedupePassword },
    );

    await page.reload();

    // Step 8: wait again for authenticated workspace after relogin
    await expect(page.getByTestId('go-back-card')).toBeVisible();
    await expect(page.getByTestId('thread-item').first()).toBeVisible();

    // Step 9: confirm imported thread still exists only once
    const importedThreadAfterSecondLogin = page
      .getByTestId('thread-item')
      .filter({ hasText: guestThreadName });

    await expect(importedThreadAfterSecondLogin).toHaveCount(1);

    // Step 10: confirm imported checkin still appears after relogin
    await expect(page.getByTestId('checkins-history')).toContainText(
      guestCheckinTitle,
    );
  });
});
