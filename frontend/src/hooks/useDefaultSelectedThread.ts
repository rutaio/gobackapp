import { useEffect } from 'react';
import type { Checkin, Thread } from '../types/types';

export function useDefaultSelectedThread(
  hasLoadedCheckins: boolean,
  hasLoadedThreads: boolean,
  selectedThreadId: string | null,
  setSelectedThreadId: (id: string | null) => void,
  checkinsHistory: Checkin[],
  threadsState: Thread[],
  lastThreadStorageKey: string,
) {
  // set default selected thread
  useEffect(() => {
    if (!hasLoadedCheckins || !hasLoadedThreads) return;
    if (selectedThreadId) return;

    const lastThreadId = localStorage.getItem(lastThreadStorageKey);

    // find the most recent checkin
    const mostRecentCheckin = checkinsHistory.reduce<Checkin | null>(
      (latestCheckin, currentCheckin) =>
        !latestCheckin || currentCheckin.createdAt > latestCheckin.createdAt
          ? currentCheckin
          : latestCheckin,
      null,
    );

    const defaultThreadId =
      // 	if the user has checkins,	take the thread of the most recent checkin
      mostRecentCheckin?.threadId ??
      // 	if no check-ins exist yet, fall back to the last thread the user clicked
      lastThreadId ??
      // 	if this is a brand-new user, just show the first thread
      threadsState[0]?.id ??
      null;

    setSelectedThreadId(defaultThreadId);
  }, [
    hasLoadedCheckins,
    hasLoadedThreads,
    selectedThreadId,
    checkinsHistory,
    threadsState,
    lastThreadStorageKey,
    setSelectedThreadId,
  ]);
}
