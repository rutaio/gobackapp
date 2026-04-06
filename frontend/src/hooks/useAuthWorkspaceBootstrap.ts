import { useEffect, useRef, useState } from 'react';
import { getThreadsForUser } from '../../lib/getThreadsForUser';
import { shouldSyncGuestData } from '../../lib/shouldSyncGuestData';
import { importGuestThreadsForUser } from '../../lib/importGuestThreadsForUser';
import { importGuestCheckinsForUser } from '../../lib/importGuestCheckinsForUser';
import { getCheckinsForUser } from '../../lib/getCheckinsForUser';
import type { Checkin, Thread } from '../types/types';

type UseAuthWorkspaceBootstrapParams = {
  user: { id: string } | null;
  setSelectedThreadId: (id: string | null) => void;
  setThreadsState: React.Dispatch<React.SetStateAction<Thread[]>>;
  setCheckinsHistory: React.Dispatch<React.SetStateAction<Checkin[]>>;
  threadsStateRef: React.RefObject<Thread[]>;
  checkinsHistoryRef: React.RefObject<Checkin[]>;
  threadsStorageKey: string;
  checkinsStorageKey: string;
  lastThreadStorageKey: string;
  syncedUserKey: string;
};

type SyncGuestIfNeededParams = {
  userId: string;
  threadsStateRef: React.RefObject<Thread[]>;
  checkinsHistoryRef: React.RefObject<Checkin[]>;
  threadsStorageKey: string;
  checkinsStorageKey: string;
  lastThreadStorageKey: string;
  syncedUserKey: string;
  setSelectedThreadId: (id: string | null) => void;
};

async function syncGuestIfNeeded({
  userId,
  threadsStateRef,
  checkinsHistoryRef,
  threadsStorageKey,
  checkinsStorageKey,
  lastThreadStorageKey,
  syncedUserKey,
  setSelectedThreadId,
}: SyncGuestIfNeededParams): Promise<void> {
  const needsGuestSync = shouldSyncGuestData(
    userId,
    threadsStorageKey,
    checkinsStorageKey,
    syncedUserKey,
  );

  if (!needsGuestSync) return;

  const guestThreads = threadsStateRef.current.filter(
    (thread) => !thread.isArchived,
  );

  const guestCheckins = checkinsHistoryRef.current;
  const threadsToSync = guestThreads;

  if (threadsToSync.length === 0) return;

  const threadIdMap = await importGuestThreadsForUser(userId, threadsToSync);

  const guestLastThreadId = localStorage.getItem(lastThreadStorageKey);

  const syncedSelectedThreadId =
    (guestLastThreadId && threadIdMap[guestLastThreadId]) || null;

  if (syncedSelectedThreadId) {
    setSelectedThreadId(syncedSelectedThreadId);
  }

  await importGuestCheckinsForUser(userId, guestCheckins, threadIdMap);

  // clear guest local data after successful first sync
  localStorage.setItem(syncedUserKey, userId);
  localStorage.removeItem(threadsStorageKey);
  localStorage.removeItem(checkinsStorageKey);
}

export function useAuthWorkspaceBootstrap({
  user,
  setSelectedThreadId,
  setThreadsState,
  setCheckinsHistory,
  threadsStateRef,
  checkinsHistoryRef,
  threadsStorageKey,
  checkinsStorageKey,
  lastThreadStorageKey,
  syncedUserKey,
}: UseAuthWorkspaceBootstrapParams) {
  const [isBootstrappingAuthWorkspace, setIsBootstrappingAuthWorkspace] =
    useState(false);

  const hasBootstrappedAuthRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      hasBootstrappedAuthRef.current = null;
      setIsBootstrappingAuthWorkspace(false);
      return;
    }

    if (hasBootstrappedAuthRef.current === user.id) return;
    hasBootstrappedAuthRef.current = user.id;

    const bootstrapAuthenticatedWorkspace = async () => {
      setIsBootstrappingAuthWorkspace(true);

      try {
        await syncGuestIfNeeded({
          userId: user.id,
          threadsStateRef,
          checkinsHistoryRef,
          threadsStorageKey,
          checkinsStorageKey,
          lastThreadStorageKey,
          syncedUserKey,
          setSelectedThreadId,
        });

        const supabaseThreads = await getThreadsForUser(user.id);
        const mappedThreads = supabaseThreads.map((thread) => ({
          id: thread.id,
          name: thread.name,
          isArchived: thread.is_archived,
        }));
        setThreadsState(mappedThreads);

        const supabaseCheckins = await getCheckinsForUser(user.id);
        const mappedCheckins = supabaseCheckins.map((checkin) => ({
          id: checkin.id,
          threadId: checkin.thread_id,
          text: checkin.text,
          note: checkin.note ?? undefined,
          createdAt: new Date(checkin.created_at).getTime(),
        }));
        setCheckinsHistory(mappedCheckins);
        const activeThreads = mappedThreads.filter(
          (thread) => !thread.isArchived,
        );
        const availableThreadIds = new Set(
          activeThreads.map((thread) => thread.id),
        );
        const firstActiveThreadId = activeThreads[0]?.id ?? null;

        const mostRecentCheckin = mappedCheckins.reduce<Checkin | null>(
          (latestCheckin, currentCheckin) =>
            !latestCheckin || currentCheckin.createdAt > latestCheckin.createdAt
              ? currentCheckin
              : latestCheckin,
          null,
        );

        const candidateIds = [
          mostRecentCheckin?.threadId ?? null,
          firstActiveThreadId,
        ];

        const finalSelectedThreadId =
          candidateIds.find(
            (threadId): threadId is string =>
              !!threadId && availableThreadIds.has(threadId),
          ) ?? null;

        setSelectedThreadId(finalSelectedThreadId);
      } catch (error) {
        console.error('Failed to bootstrap authenticated workspace', error);
        hasBootstrappedAuthRef.current = null;
      } finally {
        setIsBootstrappingAuthWorkspace(false);
      }
    };

    bootstrapAuthenticatedWorkspace();
  }, [
    user,
    setSelectedThreadId,
    setThreadsState,
    setCheckinsHistory,
    threadsStateRef,
    checkinsHistoryRef,
    threadsStorageKey,
    checkinsStorageKey,
    lastThreadStorageKey,
    syncedUserKey,
  ]);

  return { isBootstrappingAuthWorkspace };
}
