import { test, expect } from '@playwright/test';

// Use Case 1
test('Case 1: selecting a thread shows its name in Go Back card', async ({
  page,
}) => {
  // open the app
  await page.goto('/');

  // find the first thread row in the list
  const firstThread = page.getByTestId('thread-item').first();

  // make sure the row exists and is visible before we interact with it
  await expect(firstThread).toBeVisible();

  // read only the thread name text (not the whole row, which includes icons)
  const threadName =
    (await firstThread.getByTestId('thread-name').textContent())?.trim() ?? '';

  // click the thread name to select it
  await firstThread.getByTestId('thread-name').click();

  // grab the GoBack card container
  const goBackCard = page.getByTestId('go-back-card');

  // expect the selected thread name in the card matches what we clicked
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

  // find the first thread row
  const firstThread = page.getByTestId('thread-item').first();

  // wait until it is visible
  await expect(firstThread).toBeVisible();

  // click the row to select the thread (so the GoBack card shows its form)
  await firstThread.click();

  // grab the GoBack card container
  const goBackCard = page.getByTestId('go-back-card');

  // find the NEW checkin title input (required field)
  const titleInput = goBackCard.getByTestId('checkin-title-input');

  // make sure it exists and is visible
  await expect(titleInput).toBeVisible();

  // create a unique checkin title so this test won’t clash with other runs
  const checkinMessage = `Test check-in ${Date.now()}`;

  // type the title into the input
  await titleInput.fill(checkinMessage);

  // find the save button
  const saveButton = goBackCard.getByTestId('save-checkin-button');

  // make sure it’s enabled (form is valid)
  await expect(saveButton).toBeEnabled();

  // click save (submits the form)
  await saveButton.click();

  // locate the history container
  const checkinsHistory = goBackCard.getByTestId('checkins-history');

  // expect the saved title appears in the history list
  await expect(checkinsHistory).toContainText(checkinMessage);
});

// Use Case 3
test('Case 3: refresh keeps last worked thread selected and shows its checkins', async ({
  page,
}) => {
  // open the app
  await page.goto('/');

  // find the first thread row
  const firstThread = page.getByTestId('thread-item').first();

  // ensure it is visible
  await expect(firstThread).toBeVisible();

  // read the thread name before clicking (so we can assert it after refresh)
  const threadName =
    (await firstThread.getByTestId('thread-name').textContent())?.trim() ?? '';

  // click the row to select the thread
  await firstThread.click();

  // grab the GoBack card container
  const goBackCard = page.getByTestId('go-back-card');

  // find the NEW title input
  const titleInput = goBackCard.getByTestId('checkin-title-input');

  // ensure it is visible
  await expect(titleInput).toBeVisible();

  // create a unique checkin title
  const checkinMessage = `A3 check-in ${Date.now()}`;

  // type the title
  await titleInput.fill(checkinMessage);

  // save the checkin
  const saveButton = goBackCard.getByTestId('save-checkin-button');
  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  // confirm it appears before refresh (so we know the save worked)
  const checkinsHistory = goBackCard.getByTestId('checkins-history');
  await expect(checkinsHistory).toContainText(checkinMessage);

  // refresh the page (simulates user coming back)
  await page.reload();

  // grab the GoBack card again after reload
  const goBackCardAfter = page.getByTestId('go-back-card');

  // ensure it is visible
  await expect(goBackCardAfter).toBeVisible();

  // confirm the same thread is still selected
  await expect(goBackCardAfter.getByTestId('selected-thread-name')).toHaveText(
    threadName,
  );

  // confirm the saved checkin still shows (loaded from localStorage)
  await expect(goBackCardAfter.getByTestId('checkins-history')).toContainText(
    checkinMessage,
  );
});

// Use Case 4
test('Case 4: user can add a new thread and it survives refresh', async ({
  page,
}) => {
  // open the app
  await page.goto('/');

  // count how many thread rows exist before adding
  const beforeCount = await page.getByTestId('thread-item').count();

  // click the plus button to open the "add thread" row
  await page.getByTestId('add-thread-button').click();

  // locate the add-thread input
  const newThreadInput = page.getByTestId('new-thread-input');

  // ensure it is visible
  await expect(newThreadInput).toBeVisible();

  // create a unique thread name
  const newThreadName = `New Thread ${Date.now()}`;

  // type it into the input
  await newThreadInput.fill(newThreadName);

  // click confirm add (✓)
  await page.getByTestId('confirm-add-thread').click();

  // expect thread count increased by 1
  await expect(page.getByTestId('thread-item')).toHaveCount(beforeCount + 1);

  // confirm the new thread name appears in the list
  await expect(
    page.getByTestId('thread-name').filter({ hasText: newThreadName }),
  ).toHaveCount(1);

  // reload the page
  await page.reload();

  // confirm the thread still exists after refresh (stored in localStorage)
  await expect(
    page.getByTestId('thread-name').filter({ hasText: newThreadName }),
  ).toHaveCount(1);
});

// Use Case 5
test('Case 5: user can cancel adding a thread (no thread created)', async ({
  page,
}) => {
  // open the app
  await page.goto('/');

  // count threads before
  const beforeCount = await page.getByTestId('thread-item').count();

  // open add-thread UI
  await page.getByTestId('add-thread-button').click();

  // locate the input
  const newThreadInput = page.getByTestId('new-thread-input');

  // ensure it is visible
  await expect(newThreadInput).toBeVisible();

  // type a draft name (but we will cancel)
  const draftName = `Draft ${Date.now()}`;
  await newThreadInput.fill(draftName);

  // click cancel (×)
  await page.getByTestId('cancel-add-thread').click();

  // confirm thread count did NOT change
  await expect(page.getByTestId('thread-item')).toHaveCount(beforeCount);

  // confirm the draft name does NOT exist in the list
  await expect(
    page.getByTestId('thread-name').filter({ hasText: draftName }),
  ).toHaveCount(0);
});

// Use Case 6 (0 checkins → archive immediately)
test('Case 6: archiving a thread with NO checkins archives immediately (no confirmation UI)', async ({
  page,
}) => {
  await page.goto('/');

  // create thread
  await page.getByTestId('add-thread-button').click();
  const threadName = `Empty Thread ${Date.now()}`;
  await page.getByTestId('new-thread-input').fill(threadName);
  await page.getByTestId('confirm-add-thread').click();

  // select thread via tab
  const threadNameEl = page
    .getByTestId('thread-name')
    .filter({ hasText: threadName });
  await expect(threadNameEl).toHaveCount(1);
  await threadNameEl.click();

  // archive via GoBackCard (controls moved here)
  const goBackCard = page.getByTestId('go-back-card');
  await expect(goBackCard.getByTestId('thread-archive-button')).toBeVisible();
  await goBackCard.getByTestId('thread-archive-button').click();

  // no confirmation UI for empty thread
  await expect(goBackCard.getByTestId('thread-archive-confirm')).toHaveCount(0);

  // thread removed from tabs list
  await expect(
    page.getByTestId('thread-name').filter({ hasText: threadName }),
  ).toHaveCount(0);
});

// Use Case 7 (has checkins → show confirm UI, don’t archive yet)
test('Case 7: archiving a thread WITH checkins shows inline confirmation (does not archive yet)', async ({
  page,
}) => {
  await page.goto('/');

  // create thread
  await page.getByTestId('add-thread-button').click();
  const threadName = `Has Checkins Thread ${Date.now()}`;
  await page.getByTestId('new-thread-input').fill(threadName);
  await page.getByTestId('confirm-add-thread').click();

  // select thread
  const threadNameEl = page
    .getByTestId('thread-name')
    .filter({ hasText: threadName });
  await expect(threadNameEl).toHaveCount(1);
  await threadNameEl.click();

  const goBackCard = page.getByTestId('go-back-card');

  // add a checkin
  const titleInput = goBackCard.getByTestId('checkin-title-input');
  await expect(titleInput).toBeVisible();

  const checkinMessage = `Checkin for archive confirm ${Date.now()}`;
  await titleInput.fill(checkinMessage);
  await goBackCard.getByTestId('save-checkin-button').click();

  await expect(goBackCard.getByTestId('checkins-history')).toContainText(
    checkinMessage,
  );

  // click archive (now in card)
  await goBackCard.getByTestId('thread-archive-button').click();

  // confirmation UI should appear
  await expect(goBackCard.getByTestId('thread-archive-confirm')).toBeVisible();

  // thread should still exist (not archived yet)
  await expect(
    page.getByTestId('thread-name').filter({ hasText: threadName }),
  ).toHaveCount(1);
});

// Use Case 8 (cancel + confirm flow)
test('Case 8: user can cancel and confirm inline archive for a thread with checkins', async ({
  page,
}) => {
  await page.goto('/');

  // create thread
  await page.getByTestId('add-thread-button').click();
  const threadName = `Archive Thread ${Date.now()}`;
  await page.getByTestId('new-thread-input').fill(threadName);
  await page.getByTestId('confirm-add-thread').click();

  // select thread
  const threadNameEl = page
    .getByTestId('thread-name')
    .filter({ hasText: threadName });
  await expect(threadNameEl).toHaveCount(1);
  await threadNameEl.click();

  const goBackCard = page.getByTestId('go-back-card');

  // add a checkin
  const titleInput = goBackCard.getByTestId('checkin-title-input');
  await expect(titleInput).toBeVisible();

  const checkinMessage = `Archive confirm ${Date.now()}`;
  await titleInput.fill(checkinMessage);
  await goBackCard.getByTestId('save-checkin-button').click();

  await expect(goBackCard.getByTestId('checkins-history')).toContainText(
    checkinMessage,
  );

  // open confirm UI
  await goBackCard.getByTestId('thread-archive-button').click();
  await expect(goBackCard.getByTestId('thread-archive-confirm')).toBeVisible();

  // cancel
  await goBackCard.getByTestId('cancel-archive-thread').click();
  await expect(goBackCard.getByTestId('thread-archive-confirm')).toHaveCount(0);

  // still exists
  await expect(
    page.getByTestId('thread-name').filter({ hasText: threadName }),
  ).toHaveCount(1);

  // open confirm UI again and confirm
  await goBackCard.getByTestId('thread-archive-button').click();
  await expect(goBackCard.getByTestId('thread-archive-confirm')).toBeVisible();

  await goBackCard.getByTestId('confirm-archive-thread').click();

  // removed from tabs list
  await expect(
    page.getByTestId('thread-name').filter({ hasText: threadName }),
  ).toHaveCount(0);
});

// Use Case 9 (archive immediately after adding checkin → requires confirmation)
test('Case 9: archiving immediately after adding a checkin requires confirmation (no refresh)', async ({
  page,
}) => {
  await page.goto('/');

  // create thread
  await page.getByTestId('add-thread-button').click();
  const threadName = `Instant Archive ${Date.now()}`;
  await page.getByTestId('new-thread-input').fill(threadName);
  await page.getByTestId('confirm-add-thread').click();

  // select thread
  const threadNameEl = page
    .getByTestId('thread-name')
    .filter({ hasText: threadName });
  await expect(threadNameEl).toHaveCount(1);
  await threadNameEl.click();

  const goBackCard = page.getByTestId('go-back-card');

  // add checkin
  const titleInput = goBackCard.getByTestId('checkin-title-input');
  await expect(titleInput).toBeVisible();

  const checkinMessage = `Immediate ${Date.now()}`;
  await titleInput.fill(checkinMessage);
  await goBackCard.getByTestId('save-checkin-button').click();

  // archive immediately → should require confirmation
  await goBackCard.getByTestId('thread-archive-button').click();
  await expect(goBackCard.getByTestId('thread-archive-confirm')).toBeVisible();
});

// Use Case 10 (note collapsed by default, expands on click)
test('Case 10: step with note is collapsed by default and expands on click', async ({
  page,
}) => {
  await page.goto('/');

  // create a new activity
  await page.getByTestId('add-thread-button').click();
  const activityName = `Notes Activity ${Date.now()}`;
  await page.getByTestId('new-thread-input').fill(activityName);
  await page.getByTestId('confirm-add-thread').click();

  // select the activity
  const activityNameEl = page
    .getByTestId('thread-name')
    .filter({ hasText: activityName });
  await expect(activityNameEl).toHaveCount(1);
  await activityNameEl.click();

  const goBackCard = page.getByTestId('go-back-card');

  const titleInput = goBackCard.getByTestId('checkin-title-input');
  const noteInput = goBackCard.getByTestId('checkin-note-input');

  await expect(titleInput).toBeVisible();
  await expect(noteInput).toBeVisible();

  const title = `Step title ${Date.now()}`;
  const note = `This is a note ${Date.now()}`;

  await titleInput.fill(title);
  await noteInput.fill(note);
  await goBackCard.getByTestId('save-checkin-button').click();

  // IMPORTANT: button accessible name may include chevron, so use hasText
  const stepButton = goBackCard.locator('button.checkin-title--clickable', {
    hasText: title,
  });
  await expect(stepButton).toBeVisible();

  // note collapsed by default
  await expect(goBackCard.getByTestId('checkin-note')).toHaveCount(0);

  // expand
  await stepButton.click();

  const noteElement = goBackCard.getByTestId('checkin-note');
  await expect(noteElement).toHaveCount(1);
  await expect(noteElement).toHaveText(note);

  // collapse
  await stepButton.click();
  await expect(goBackCard.getByTestId('checkin-note')).toHaveCount(0);
});
