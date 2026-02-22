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

  // click the thread name (more precise than clicking entire <li>)
  await firstThread.getByTestId('thread-name').click();

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
  await page.goto('/');

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

// Use Case 4:
test('Case 4: user can add a new thread and it survives refresh', async ({
  page,
}) => {
  // Open app
  await page.goto('/');

  // Count threads before adding
  const beforeCount = await page.getByTestId('thread-item').count();

  // Open add-thread UI
  await page.getByTestId('add-thread-button').click();

  // Locate input field
  const newThreadInput = page.getByTestId('new-thread-input');

  // Ensure input is visible
  await expect(newThreadInput).toBeVisible();

  // Create unique thread name
  const newThreadName = `New Thread ${Date.now()}`;

  // Fill input
  await newThreadInput.fill(newThreadName);

  // Confirm add
  await page.getByTestId('confirm-add-thread').click();

  // Confirm thread count increased
  await expect(page.getByTestId('thread-item')).toHaveCount(beforeCount + 1);

  // Confirm the new thread appears in the Threads list (scoped)
  await expect(
    page.getByTestId('thread-name').filter({ hasText: newThreadName }),
  ).toHaveCount(1);

  // Reload page
  await page.reload();

  // Confirm thread still exists after refresh (scoped)
  await expect(
    page.getByTestId('thread-name').filter({ hasText: newThreadName }),
  ).toHaveCount(1);
});

// Use Case 5:
test('Case 5: user can cancel adding a thread (no thread created)', async ({
  page,
}) => {
  // Open app
  await page.goto('/');

  // Count threads before
  const beforeCount = await page.getByTestId('thread-item').count();

  // Open add UI
  await page.getByTestId('add-thread-button').click();

  // Locate input
  const newThreadInput = page.getByTestId('new-thread-input');
  await expect(newThreadInput).toBeVisible();

  // Type draft name
  const draftName = `Draft ${Date.now()}`;
  await newThreadInput.fill(draftName);

  // Click cancel
  await page.getByTestId('cancel-add-thread').click();

  // Confirm thread count unchanged
  await expect(page.getByTestId('thread-item')).toHaveCount(beforeCount);

  // Confirm draft name does NOT appear in the Threads list
  await expect(
    page.getByTestId('thread-name').filter({ hasText: draftName }),
  ).toHaveCount(0);
});

// Use Case 6 (0 checkins → archive immediately)
test('Case 6: archiving a thread with NO checkins archives immediately (no confirmation UI)', async ({
  page,
}) => {
  // open the app
  await page.goto('/');

  // create a brand-new thread so we know it has 0 checkins
  await page.getByTestId('add-thread-button').click();

  // fill a unique thread name
  const threadName = `Empty Thread ${Date.now()}`;
  await page.getByTestId('new-thread-input').fill(threadName);

  // confirm add
  await page.getByTestId('confirm-add-thread').click();

  // ensure the new thread appears in the list
  const threadNameEl = page
    .getByTestId('thread-name')
    .filter({ hasText: threadName });
  await expect(threadNameEl).toHaveCount(1);

  // select the new thread (so archive icon becomes visible)
  await threadNameEl.click();

  // locate the row for this thread
  const threadRow = page.getByTestId('thread-item').filter({
    has: page.getByTestId('thread-name').filter({ hasText: threadName }),
  });
  await expect(threadRow).toHaveCount(1);

  // click the archive (bin) button
  await threadRow.getByTestId('thread-archive-button').click();

  // confirm the inline confirmation UI did NOT appear (archive should be immediate)
  await expect(threadRow.getByTestId('thread-archive-confirm')).toHaveCount(0);

  // confirm the thread is removed from the list
  await expect(
    page.getByTestId('thread-name').filter({ hasText: threadName }),
  ).toHaveCount(0);
});

// Use Case 7 (has checkins → show confirm UI, don’t archive yet)
test('Case 7: archiving a thread WITH checkins shows inline confirmation (does not archive yet)', async ({
  page,
}) => {
  // open the app
  await page.goto('/');

  // create a brand-new thread so the test is isolated
  await page.getByTestId('add-thread-button').click();

  const threadName = `Has Checkins Thread ${Date.now()}`;
  await page.getByTestId('new-thread-input').fill(threadName);

  // confirm add
  await page.getByTestId('confirm-add-thread').click();

  // ensure it appears
  const threadNameEl = page
    .getByTestId('thread-name')
    .filter({ hasText: threadName });
  await expect(threadNameEl).toHaveCount(1);

  // select it (so GoBack card targets this thread)
  await threadNameEl.click();

  // add a checkin so this thread has history
  const goBackCard = page.getByTestId('go-back-card');
  const checkinTextarea = goBackCard.locator('textarea#checkin');
  await expect(checkinTextarea).toBeVisible();

  const checkinMessage = `Checkin for archive confirm ${Date.now()}`;
  await checkinTextarea.fill(checkinMessage);

  const saveButton = goBackCard.getByTestId('save-checkin-button');
  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  // confirm the checkin was saved (so we know thread has >= 1 checkin)
  await expect(goBackCard.getByTestId('checkins-history')).toContainText(
    checkinMessage,
  );

  // locate the row again (stable + explicit)
  const threadRow = page.getByTestId('thread-item').filter({
    has: page.getByTestId('thread-name').filter({ hasText: threadName }),
  });
  await expect(threadRow).toHaveCount(1);

  // click the archive button (should open inline confirmation, not archive yet)
  await threadRow.getByTestId('thread-archive-button').click();

  // confirm inline confirmation UI appears
  await expect(threadRow.getByTestId('thread-archive-confirm')).toBeVisible();

  // confirm the thread is NOT archived yet (still visible)
  await expect(
    page.getByTestId('thread-name').filter({ hasText: threadName }),
  ).toHaveCount(1);
});

// Use Case 8 (cancel + confirm flow)
test('Case 8: user can cancel and confirm inline archive for a thread with checkins', async ({
  page,
}) => {
  // open the app
  await page.goto('/');

  // create a brand-new thread so the test is isolated
  await page.getByTestId('add-thread-button').click();
  const threadName = `Archive Thread ${Date.now()}`;
  await page.getByTestId('new-thread-input').fill(threadName);
  await page.getByTestId('confirm-add-thread').click();

  // select the new thread (so archive icon is visible)
  const threadNameEl = page
    .getByTestId('thread-name')
    .filter({ hasText: threadName });
  await expect(threadNameEl).toHaveCount(1);
  await threadNameEl.click();

  // add a checkin to force confirmation flow
  const goBackCard = page.getByTestId('go-back-card');
  const checkinTextarea = goBackCard.locator('textarea#checkin');
  await expect(checkinTextarea).toBeVisible();

  const checkinMessage = `Archive confirm ${Date.now()}`;
  await checkinTextarea.fill(checkinMessage);

  const saveButton = goBackCard.getByTestId('save-checkin-button');
  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  // confirm checkin saved
  await expect(goBackCard.getByTestId('checkins-history')).toContainText(
    checkinMessage,
  );

  // locate the correct thread row
  const threadRow = page.getByTestId('thread-item').filter({
    has: page.getByTestId('thread-name').filter({ hasText: threadName }),
  });
  await expect(threadRow).toHaveCount(1);

  // click archive button to open inline confirmation
  await threadRow.getByTestId('thread-archive-button').click();

  // confirm confirmation UI is visible
  await expect(threadRow.getByTestId('thread-archive-confirm')).toBeVisible();

  // click cancel (×)
  await threadRow.getByTestId('cancel-archive-thread').click();

  // confirm confirmation UI disappears
  await expect(threadRow.getByTestId('thread-archive-confirm')).toHaveCount(0);

  // confirm thread still exists
  await expect(
    page.getByTestId('thread-name').filter({ hasText: threadName }),
  ).toHaveCount(1);

  // open confirmation again
  await threadRow.getByTestId('thread-archive-button').click();
  await expect(threadRow.getByTestId('thread-archive-confirm')).toBeVisible();

  // click confirm (✓)
  await threadRow.getByTestId('confirm-archive-thread').click();

  // confirm thread is removed from list
  await expect(
    page.getByTestId('thread-name').filter({ hasText: threadName }),
  ).toHaveCount(0);
});
