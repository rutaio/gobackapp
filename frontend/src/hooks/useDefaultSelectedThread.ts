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

    const activeThreads = threadsState.filter((thread) => !thread.isArchived);
    const availableThreadIds = new Set(
      activeThreads.map((thread) => thread.id),
    );
    const firstActiveThreadId = activeThreads[0]?.id ?? null;

    // if current selected thread still exists, keep it
    if (selectedThreadId && availableThreadIds.has(selectedThreadId)) return;

    const lastThreadId = localStorage.getItem(lastThreadStorageKey);

    // find the most recent checkin
    const mostRecentCheckin = checkinsHistory.reduce<Checkin | null>(
      (latestCheckin, currentCheckin) =>
        !latestCheckin || currentCheckin.createdAt > latestCheckin.createdAt
          ? currentCheckin
          : latestCheckin,
      null,
    );

    const candidateIds = [
      // if the user already had a last active thread, keep that continuity first
      lastThreadId,

      // otherwise use the thread of the most recent checkin
      mostRecentCheckin?.threadId ?? null,

      // if this is a brand-new user, just show the first available thread
      firstActiveThreadId,
    ];

    // only select ids that still exist in the current thread list
    const firstValidThreadId =
      candidateIds.find(
        (threadId): threadId is string =>
          !!threadId && availableThreadIds.has(threadId),
      ) ?? null;

    setSelectedThreadId(firstValidThreadId);
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
