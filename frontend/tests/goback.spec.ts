import { test, expect } from '@playwright/test';

// Use Case 1
test('Case 1: selecting a thread shows its name in Go Back card', async ({
  page,
}) => {
  // open the app
  await page.goto('/');

  // find the first thread in the list
  const firstThread = page.getByTestId('thread-item').first();

  // wait until it is visible
  await expect(firstThread).toBeVisible();

  // read only the name, not the whole row (which includes ✏️)
  const threadName =
    (await firstThread.getByTestId('thread-name').textContent())?.trim() ?? '';

  // click to select the thread
  await firstThread.click();

  // expect the Go Back card to show the selected thread name
  const goBackCard = page.getByTestId('go-back-card');
  await expect(goBackCard.getByTestId('selected-thread-name')).toHaveText(
    threadName,
  );
});

// Use Case 2
test('Case 2: saving a checkin shows it in history for the selected thread', async ({
  page,
}) => {
  // open the app
  await page.goto('/');

  // find the first thread in the list
  const firstThread = page.getByTestId('thread-item').first();

  // wait until it is visible
  await expect(firstThread).toBeVisible();

  // click to select the thread
  await firstThread.click();

  // find the checkin textarea in Go Back card
  const goBackCard = page.getByTestId('go-back-card');
  const checkinTextarea = page
    .getByTestId('go-back-card')
    .locator('textarea#checkin');

  // wait until it is visible
  await expect(checkinTextarea).toBeVisible();

  // type a unique checkin message
  const checkinMessage = `Test check-in ${Date.now()}`;
  await checkinTextarea.fill(checkinMessage);

  // click to save button and submit the form
  const saveButton = goBackCard.getByTestId('save-checkin-button');
  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  // find the ckeckins in history
  const checkinsHistory = goBackCard.getByTestId('checkins-history');

  // expect the new checkin to appear in history
  await expect(checkinsHistory).toContainText(checkinMessage);
});

// Use Case 3:
test('Case 3: refresh keeps last worked thread selected and shows its checkins', async ({
  page,
}) => {
  // open the app
  await page.goto('');

  // select the first thread
  const firstThread = page.getByTestId('thread-item').first();
  await expect(firstThread).toBeVisible();

  // capture its name BEFORE clicking
  // read only the name, not the whole row (which includes ✏️)
  const threadName =
    (await firstThread.getByTestId('thread-name').textContent())?.trim() ?? '';

  // click to select
  await firstThread.click();

  // add a checkin so we know what to look for after refresh
  const goBackCard = page.getByTestId('go-back-card');
  const checkinTextarea = goBackCard.locator('textarea#checkin');
  await expect(checkinTextarea).toBeVisible();

  const checkinMessage = `A3 check-in ${Date.now()}`;
  await checkinTextarea.fill(checkinMessage);

  // save
  const saveButton = goBackCard.getByTestId('save-checkin-button');
  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  // confirm it appears before refresh
  const checkinsHistory = goBackCard.getByTestId('checkins-history');
  await expect(checkinsHistory).toContainText(checkinMessage);

  // refresh the page
  await page.reload();

  // after reload: GoBackCard should still show the same selected thread
  const goBackCardAfter = page.getByTestId('go-back-card');
  await expect(goBackCardAfter).toBeVisible();

  // confirm selected thread name is still the same
  const selectedThreadName = goBackCardAfter.getByTestId(
    'selected-thread-name',
  );
  await expect(selectedThreadName).toHaveText(threadName);

  // confirm the checkin is still visible (loaded from localStorage)
  const checkinsHistoryAfter = goBackCardAfter.getByTestId('checkins-history');
  await expect(checkinsHistoryAfter).toContainText(checkinMessage);
});
