import { test, expect } from '@playwright/test';

test.use({ storageState: 'playwright/.auth/user.json' });

// Case 1
test('authenticated user can create checkin and it survives refresh', async ({
  page,
}) => {
  await page.goto('/');

  // Wait until authenticated workspace loads
  const goBackCard = page.getByTestId('go-back-card');
  await expect(goBackCard).toBeVisible();

  // Select first visible thread
  const firstThread = page.getByTestId('thread-item').first();
  await expect(firstThread).toBeVisible();
  await firstThread.getByRole('button').click();

  // Create a unique checkin title so repeated test runs do not clash
  const checkinTitle = `Auth checkin ${Date.now()}`;

  const titleInput = page.getByTestId('checkin-title-input');
  await expect(titleInput).toBeVisible();
  await titleInput.fill(checkinTitle);

  const saveButton = page.getByTestId('save-checkin-button');
  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  // Confirm it appears before refresh
  const checkinsHistory = page.getByTestId('checkins-history');
  await expect(checkinsHistory).toContainText(checkinTitle);

  // Refresh page
  await page.reload();

  // Wait for hydrated authenticated UI again
  await expect(page.getByTestId('go-back-card')).toBeVisible();
  await expect(page.getByTestId('checkins-history')).toContainText(
    checkinTitle,
  );
});

// Case 2
test('authenticated user can create a new thread and it survives refresh', async ({
  page,
}) => {
  await page.goto('/');

  const threadName = `PW thread ${Date.now()}`;

  const addThreadButton = page.getByTestId('add-thread-button');
  await expect(addThreadButton).toBeVisible();
  await addThreadButton.click();

  const addForm = page.getByTestId('threads-add-form');
  await expect(addForm).toBeVisible();

  const newThreadInput = page.getByTestId('new-thread-input');
  await expect(newThreadInput).toBeVisible();
  await newThreadInput.fill(threadName);

  const confirmAddButton = page.getByTestId('confirm-add-thread');
  await expect(confirmAddButton).toBeEnabled();
  await confirmAddButton.click();

  await expect(
    page.getByTestId('thread-item').filter({ hasText: threadName }),
  ).toBeVisible();

  await page.reload();

  await expect(
    page.getByTestId('thread-item').filter({ hasText: threadName }),
  ).toBeVisible();
});

// Case 3
test('authenticated user can edit a thread name and it survives refresh', async ({
  page,
}) => {
  await page.goto('/');

  const originalThreadName = `PW thread ${Date.now()}`;
  const renamedThreadName = `PW renamed ${Date.now()}`;

  // Create a safe test thread first
  const addThreadButton = page.getByTestId('add-thread-button');
  await expect(addThreadButton).toBeVisible();
  await addThreadButton.click();

  const newThreadInput = page.getByTestId('new-thread-input');
  await expect(newThreadInput).toBeVisible();
  await newThreadInput.fill(originalThreadName);

  const confirmAddButton = page.getByTestId('confirm-add-thread');
  await expect(confirmAddButton).toBeEnabled();
  await confirmAddButton.click();

  const createdThread = page
    .getByTestId('thread-item')
    .filter({ hasText: originalThreadName });
  await expect(createdThread).toBeVisible();

  // Rename selected thread
  const renameButton = page.getByRole('button', { name: 'Rename activity' });
  await expect(renameButton).toBeVisible();
  await renameButton.click();

  const renameInput = page.getByRole('textbox', { name: 'Rename activity' });
  await expect(renameInput).toBeVisible();
  await renameInput.fill(renamedThreadName);

  const confirmRenameButton = page.getByRole('button', {
    name: 'Confirm rename',
  });
  await expect(confirmRenameButton).toBeVisible();
  await confirmRenameButton.click();

  // Confirm updated name appears immediately
  await expect(
    page.getByTestId('thread-item').filter({ hasText: renamedThreadName }),
  ).toBeVisible();

  // Confirm old name is gone
  await expect(
    page.getByTestId('thread-item').filter({ hasText: originalThreadName }),
  ).toHaveCount(0);

  // Refresh and confirm updated name still exists
  await page.reload();

  await expect(
    page.getByTestId('thread-item').filter({ hasText: renamedThreadName }),
  ).toBeVisible();

  // Confirm old name is still gone after refresh
  await expect(
    page.getByTestId('thread-item').filter({ hasText: originalThreadName }),
  ).toHaveCount(0);
});

// Case 4
test('authenticated user can archive a thread and it stays archived after refresh', async ({
  page,
}) => {
  await page.goto('/');

  const threadName = `PW archive ${Date.now()}`;

  // Create a safe empty thread first
  const addThreadButton = page.getByTestId('add-thread-button');
  await expect(addThreadButton).toBeVisible();
  await addThreadButton.click();

  const newThreadInput = page.getByTestId('new-thread-input');
  await expect(newThreadInput).toBeVisible();
  await newThreadInput.fill(threadName);

  const confirmAddButton = page.getByTestId('confirm-add-thread');
  await expect(confirmAddButton).toBeEnabled();
  await confirmAddButton.click();

  const createdThread = page
    .getByTestId('thread-item')
    .filter({ hasText: threadName });
  await expect(createdThread).toBeVisible();

  // Archive selected thread
  const archiveButton = page.getByTestId('thread-archive-button');
  await expect(archiveButton).toBeVisible();
  await archiveButton.click();

  // Empty thread should archive immediately without confirmation
  await expect(
    page.getByTestId('thread-item').filter({ hasText: threadName }),
  ).toHaveCount(0);

  // Refresh and confirm thread is still hidden
  await page.reload();

  await expect(
    page.getByTestId('thread-item').filter({ hasText: threadName }),
  ).toHaveCount(0);
});

// Case 5
test('already logged-in user lands in the correct place after app load', async ({
  page,
}) => {
  await page.goto('/');

  // Authenticated workspace loads
  await expect(page.getByTestId('go-back-card')).toBeVisible();

  // At least one thread exists
  await expect(page.getByTestId('thread-item').first()).toBeVisible();

  // A selected thread is active
  await expect(page.getByTestId('selected-thread-name')).toBeVisible();

  // Checkin form is available
  await expect(page.getByTestId('checkin-title-input')).toBeVisible();

  // Optional: guest login CTA should not be visible
  await expect(
    page.getByRole('button', { name: /sign in with google/i }),
  ).toHaveCount(0);
});

// Case 6
test('logged-in user does not see guest-only onboarding or login state', async ({
  page,
}) => {
  await page.goto('/');

  // Authenticated workspace is visible
  await expect(page.getByTestId('go-back-card')).toBeVisible();
  await expect(page.getByTestId('selected-thread-name')).toBeVisible();

  // Guest/login CTA is not shown
  await expect(
    page.getByRole('button', { name: /continue with google/i }),
  ).toHaveCount(0);

  // Returning-user login prompt text is not shown
  await expect(
    page.getByText('You already have an account. Log in to continue.'),
  ).toHaveCount(0);

  await expect(page.getByText('Guest mode is local only.')).toHaveCount(0);
});

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
        const { supabase } = await import('/src/lib/supabaseClient.ts');

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
