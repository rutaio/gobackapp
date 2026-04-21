function safeCount(value: string | null) {
  if (!value) return 0;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

export function shouldSyncGuestData(
  userId: string,
  threadsStorageKey: string,
  checkinsStorageKey: string,
  syncedUserKey: string,
) {
  const syncedUserId = localStorage.getItem(syncedUserKey);

  const hasGuestThreads =
    safeCount(localStorage.getItem(threadsStorageKey)) > 0;
  const hasGuestCheckins =
    safeCount(localStorage.getItem(checkinsStorageKey)) > 0;

  const hasGuestData = hasGuestThreads || hasGuestCheckins;
  const alreadySyncedForThisUser = syncedUserId === userId;

  return hasGuestData && !alreadySyncedForThisUser;
}
