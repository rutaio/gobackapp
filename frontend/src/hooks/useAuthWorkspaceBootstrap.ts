import { useEffect, useRef, useState } from 'react';
import { getThreadsForUser } from '../../lib/getThreadsForUser';
import { shouldSyncGuestData } from '../../lib/shouldSyncGuestData';
import { importGuestThreadsForUser } from '../../lib/importGuestThreadsForUser';
import { importGuestCheckinsForUser } from '../../lib/importGuestCheckinsForUser';
import { getCheckinsForUser } from '../../lib/getCheckinsForUser';
import type { Checkin, Thread } from '../types/types';

type UseAuthWorkspaceBootstrapParams = {
  user: { id: string } | null;
  selectedThreadId: string | null;
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

export function useAuthWorkspaceBootstrap({
  user,
  selectedThreadId,
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

      let syncedSelectedThreadId: string | null = null;

      try {
        const needsGuestSync = shouldSyncGuestData(
          user.id,
          threadsStorageKey,
          checkinsStorageKey,
          syncedUserKey,
        );

        if (needsGuestSync) {
          const guestThreads = threadsStateRef.current.filter(
            (thread) => !thread.isArchived,
          );

          const guestCheckins = checkinsHistoryRef.current;

          const threadsToSync = guestThreads;

          if (threadsToSync.length > 0) {
            const threadIdMap = await importGuestThreadsForUser(
              user.id,
              threadsToSync,
            );

            const guestLastThreadId =
              localStorage.getItem(lastThreadStorageKey);

            syncedSelectedThreadId =
              (guestLastThreadId && threadIdMap[guestLastThreadId]) || null;

            if (syncedSelectedThreadId) {
              setSelectedThreadId(syncedSelectedThreadId);
            }

            await importGuestCheckinsForUser(
              user.id,
              guestCheckins,
              threadIdMap,
            );

            // clear guest local data after successful first sync
            localStorage.setItem(syncedUserKey, user.id);
            localStorage.removeItem(threadsStorageKey);
            localStorage.removeItem(checkinsStorageKey);
          }
        }

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
    selectedThreadId,
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
