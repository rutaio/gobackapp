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

          const threadIdsWithCheckins = new Set(
            guestCheckins.map((checkin) => checkin.threadId),
          );

          const threadsToSync = guestThreads.filter(
            (thread) => !thread.isSeed || threadIdsWithCheckins.has(thread.id),
          );

          if (threadsToSync.length > 0) {
            const threadIdMap = await importGuestThreadsForUser(
              user.id,
              threadsToSync,
            );

            const guestLastThreadId =
              localStorage.getItem(lastThreadStorageKey);

            const syncedLastThreadId =
              (selectedThreadId && threadIdMap[selectedThreadId]) ||
              (guestLastThreadId && threadIdMap[guestLastThreadId]) ||
              null;

            if (syncedLastThreadId) {
              setSelectedThreadId(syncedLastThreadId);
              localStorage.setItem(lastThreadStorageKey, syncedLastThreadId);
            }

            await importGuestCheckinsForUser(
              user.id,
              guestCheckins,
              threadIdMap,
            );

            localStorage.setItem(syncedUserKey, user.id);
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
