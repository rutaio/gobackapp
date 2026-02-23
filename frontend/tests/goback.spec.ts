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
  // open the app
  await page.goto('/');

  // open add-thread UI
  await page.getByTestId('add-thread-button').click();

  // create a unique thread name so we know which row to find
  const threadName = `Empty Thread ${Date.now()}`;

  // type thread name
  await page.getByTestId('new-thread-input').fill(threadName);

  // confirm add
  await page.getByTestId('confirm-add-thread').click();

  // locate the created thread name element
  const threadNameEl = page
    .getByTestId('thread-name')
    .filter({ hasText: threadName });

  // ensure it exists
  await expect(threadNameEl).toHaveCount(1);

  // click to select the thread (archive icon only shows on selected row)
  await threadNameEl.click();

  // locate the full row (<li>) that contains this thread name
  const threadRow = page.getByTestId('thread-item').filter({
    has: page.getByTestId('thread-name').filter({ hasText: threadName }),
  });

  // ensure we found exactly one row
  await expect(threadRow).toHaveCount(1);

  // click the archive (bin) button
  await threadRow.getByTestId('thread-archive-button').click();

  // confirm inline confirmation UI did NOT appear
  await expect(threadRow.getByTestId('thread-archive-confirm')).toHaveCount(0);

  // confirm the thread is removed from the list (archived)
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

  // create a new thread to keep the test isolated
  await page.getByTestId('add-thread-button').click();

  // unique thread name for this test
  const threadName = `Has Checkins Thread ${Date.now()}`;

  // type the name and confirm add
  await page.getByTestId('new-thread-input').fill(threadName);
  await page.getByTestId('confirm-add-thread').click();

  // find the thread name element
  const threadNameEl = page
    .getByTestId('thread-name')
    .filter({ hasText: threadName });

  // ensure it exists
  await expect(threadNameEl).toHaveCount(1);

  // select the thread so the GoBack card targets it
  await threadNameEl.click();

  // grab GoBack card
  const goBackCard = page.getByTestId('go-back-card');

  // locate the NEW title input
  const titleInput = goBackCard.getByTestId('checkin-title-input');

  // ensure it is visible
  await expect(titleInput).toBeVisible();

  // create a unique checkin
  const checkinMessage = `Checkin for archive confirm ${Date.now()}`;

  // type the checkin title
  await titleInput.fill(checkinMessage);

  // save the checkin
  const saveButton = goBackCard.getByTestId('save-checkin-button');
  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  // confirm it appears in history (so the thread has at least 1 checkin)
  await expect(goBackCard.getByTestId('checkins-history')).toContainText(
    checkinMessage,
  );

  // find the thread row again
  const threadRow = page.getByTestId('thread-item').filter({
    has: page.getByTestId('thread-name').filter({ hasText: threadName }),
  });

  // ensure the row exists
  await expect(threadRow).toHaveCount(1);

  // click archive button
  await threadRow.getByTestId('thread-archive-button').click();

  // confirmation UI should appear (because the thread has checkins)
  await expect(threadRow.getByTestId('thread-archive-confirm')).toBeVisible();

  // thread should still be visible (not archived yet)
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

  // create a new thread to keep test isolated
  await page.getByTestId('add-thread-button').click();

  // unique thread name
  const threadName = `Archive Thread ${Date.now()}`;

  // type name and confirm add
  await page.getByTestId('new-thread-input').fill(threadName);
  await page.getByTestId('confirm-add-thread').click();

  // locate thread name element
  const threadNameEl = page
    .getByTestId('thread-name')
    .filter({ hasText: threadName });

  // ensure it exists
  await expect(threadNameEl).toHaveCount(1);

  // select it
  await threadNameEl.click();

  // grab GoBack card
  const goBackCard = page.getByTestId('go-back-card');

  // locate NEW title input
  const titleInput = goBackCard.getByTestId('checkin-title-input');
  await expect(titleInput).toBeVisible();

  // add a checkin so confirmation flow is required
  const checkinMessage = `Archive confirm ${Date.now()}`;
  await titleInput.fill(checkinMessage);

  // save checkin
  const saveButton = goBackCard.getByTestId('save-checkin-button');
  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  // confirm checkin saved
  await expect(goBackCard.getByTestId('checkins-history')).toContainText(
    checkinMessage,
  );

  // locate the thread row
  const threadRow = page.getByTestId('thread-item').filter({
    has: page.getByTestId('thread-name').filter({ hasText: threadName }),
  });
  await expect(threadRow).toHaveCount(1);

  // open archive confirmation UI
  await threadRow.getByTestId('thread-archive-button').click();
  await expect(threadRow.getByTestId('thread-archive-confirm')).toBeVisible();

  // cancel archive
  await threadRow.getByTestId('cancel-archive-thread').click();

  // confirmation UI should disappear
  await expect(threadRow.getByTestId('thread-archive-confirm')).toHaveCount(0);

  // thread should still exist
  await expect(
    page.getByTestId('thread-name').filter({ hasText: threadName }),
  ).toHaveCount(1);

  // open confirmation again
  await threadRow.getByTestId('thread-archive-button').click();
  await expect(threadRow.getByTestId('thread-archive-confirm')).toBeVisible();

  // confirm archive (✓)
  await threadRow.getByTestId('confirm-archive-thread').click();

  // thread should be removed from list (archived)
  await expect(
    page.getByTestId('thread-name').filter({ hasText: threadName }),
  ).toHaveCount(0);
});

// Use Case 9
test('Case 9: archiving immediately after adding a checkin requires confirmation (no refresh)', async ({
  page,
}) => {
  // open the app
  await page.goto('/');

  // create a new thread
  await page.getByTestId('add-thread-button').click();

  // unique thread name
  const threadName = `Instant Archive ${Date.now()}`;

  // type name and confirm add
  await page.getByTestId('new-thread-input').fill(threadName);
  await page.getByTestId('confirm-add-thread').click();

  // locate the new thread name element
  const threadNameEl = page
    .getByTestId('thread-name')
    .filter({ hasText: threadName });

  // ensure it exists
  await expect(threadNameEl).toHaveCount(1);

  // select thread
  await threadNameEl.click();

  // grab GoBack card
  const goBackCard = page.getByTestId('go-back-card');

  // locate the NEW title input
  const titleInput = goBackCard.getByTestId('checkin-title-input');
  await expect(titleInput).toBeVisible();

  // type a checkin title
  const checkinMessage = `Immediate ${Date.now()}`;
  await titleInput.fill(checkinMessage);

  // save (we do NOT refresh)
  await goBackCard.getByTestId('save-checkin-button').click();

  // locate the thread row
  const threadRow = page.getByTestId('thread-item').filter({
    has: page.getByTestId('thread-name').filter({ hasText: threadName }),
  });

  // click archive immediately
  await threadRow.getByTestId('thread-archive-button').click();

  // confirmation UI must appear
  await expect(threadRow.getByTestId('thread-archive-confirm')).toBeVisible();
});

// Use Case 10:
test('Case 10: step with note is collapsed by default and expands on click', async ({
  page,
}) => {
  // open the app
  await page.goto('/');

  // create a new activity to keep the test isolated
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

  // grab GoBack card
  const goBackCard = page.getByTestId('go-back-card');

  // locate title + note inputs
  const titleInput = goBackCard.getByTestId('checkin-title-input');
  const noteInput = goBackCard.getByTestId('checkin-note-input');

  await expect(titleInput).toBeVisible();
  await expect(noteInput).toBeVisible();

  // create unique values
  const title = `Step title ${Date.now()}`;
  const note = `This is a note ${Date.now()}`;

  // fill form
  await titleInput.fill(title);
  await noteInput.fill(note);

  // save step
  await goBackCard.getByTestId('save-checkin-button').click();

  // locate clickable step button (only steps with notes are buttons)
  const stepButton = goBackCard.getByRole('button', { name: title });

  await expect(stepButton).toBeVisible();

  // note should NOT be visible by default
  await expect(goBackCard.getByTestId('checkin-note')).toHaveCount(0);

  // click to expand
  await stepButton.click();

  // note should now appear
  const noteElement = goBackCard.getByTestId('checkin-note');
  await expect(noteElement).toHaveCount(1);
  await expect(noteElement).toHaveText(note);

  // click again to collapse
  await stepButton.click();

  // note should disappear again
  await expect(goBackCard.getByTestId('checkin-note')).toHaveCount(0);
});
