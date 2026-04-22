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
