//	If a function mutates global/shared state → it belongs in HomePage

import { useAuthUser } from '../hooks/useAuthUser';
import '../styles/pages/home.css';
import { threads } from '../data/threads';
import { useState, useRef, useEffect } from 'react';
import { ThreadsTabs } from '../components/ThreadsTabs';
import { GoBackCard } from '../components/GoBackCard';
import type { Checkin } from '../types/types';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { LoginPrompt } from '../components/LoginPrompt';

import { createThreadForUser } from '../lib/createThreadForUser';
import { updateThreadNameForUser } from '../lib/updateThreadNameForUser';
import { updateThreadArchiveForUser } from '../lib/updateThreadArchiveForUser';
import { createCheckinForUser } from '../lib/createCheckinForUser';

import { useCheckinsStorage } from '../hooks/useCheckinsStorage';
import { useThreadsStorage } from '../hooks/useThreadsStorage';
import { useDefaultSelectedThread } from '../hooks/useDefaultSelectedThread';
import { createSeedCheckins } from '../data/seed';
import { useAuthWorkspaceBootstrap } from '../hooks/useAuthWorkspaceBootstrap';

const CHECKINS_STORAGE_KEY = 'goback_checkins_v1';
const THREADS_STORAGE_KEY = 'goback_threads_v1';
const LAST_THREAD_STORAGE_KEY = 'goback_last_thread_v1';
const HERO_DISMISSED_KEY = 'goback_hero_dismissed_v1';
const SYNCED_USER_KEY = 'goback_synced_user_id';

export const HomePage = () => {
  const { user, isCheckingAuth } = useAuthUser();

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  // split state: title + optional note
  const [checkinTitle, setCheckinTitle] = useState('');
  const [checkinNote, setCheckinNote] = useState('');
  const [threadIdPendingArchive, setThreadIdPendingArchive] = useState<
    string | null
  >(null);

  const { threadsState, setThreadsState, hasLoadedThreads } = useThreadsStorage(
    THREADS_STORAGE_KEY,
    threads,
    !user, // only enable localStorage for guest users
  );

  const { checkinsHistory, setCheckinsHistory, hasLoadedCheckins } =
    useCheckinsStorage(CHECKINS_STORAGE_KEY, !user);

  const threadsStateRef = useRef(threadsState);
  const checkinsHistoryRef = useRef<Checkin[]>([]);

  useEffect(() => {
    threadsStateRef.current = threadsState;
  }, [threadsState]);

  useEffect(() => {
    checkinsHistoryRef.current = checkinsHistory;
  }, [checkinsHistory]);

  const { isBootstrappingAuthWorkspace } = useAuthWorkspaceBootstrap({
    user,
    setSelectedThreadId,
    setThreadsState,
    setCheckinsHistory,
    threadsStateRef,
    checkinsHistoryRef,
    threadsStorageKey: THREADS_STORAGE_KEY,
    checkinsStorageKey: CHECKINS_STORAGE_KEY,
    lastThreadStorageKey: LAST_THREAD_STORAGE_KEY,
    syncedUserKey: SYNCED_USER_KEY,
  });

  const isSelectionBlocked =
    isCheckingAuth || (!!user && isBootstrappingAuthWorkspace);

  const showLoginPrompt =
    !user && localStorage.getItem(SYNCED_USER_KEY) !== null;

  useDefaultSelectedThread(
    hasLoadedCheckins,
    hasLoadedThreads,
    selectedThreadId,
    setSelectedThreadId,
    checkinsHistory,
    threadsState,
    LAST_THREAD_STORAGE_KEY,
    isSelectionBlocked,
  );

  // HELPERS
  // helper reads from ref (never stale)
  const getCheckinsCount = (threadId: string) =>
    checkinsHistoryRef.current.filter((c) => c.threadId === threadId).length;

  const selectThread = (threadId: string | null) => {
    setSelectedThreadId(threadId);

    if (!user) {
      if (threadId) {
        localStorage.setItem(LAST_THREAD_STORAGE_KEY, threadId);
      } else {
        localStorage.removeItem(LAST_THREAD_STORAGE_KEY);
      }
    }
  };

  // HANDLERS
  // thread selection
  const handleThreadClick = (threadId: string) => {
    selectThread(threadId);
    setThreadIdPendingArchive(null); // close any pending archive confirm UI
    setEditingThreadId(null); // NEW: prevents rename UI sticking
  };

  // rename
  const handleRenameConfirm = async (threadId: string, newName: string) => {
    const cleanedName = newName.trim();

    if (cleanedName === '') {
      setEditingThreadId(null);
      return;
    }

    if (user) {
      try {
        await updateThreadNameForUser(threadId, cleanedName);
      } catch (error) {
        console.error('Failed to rename thread in Supabase', error);
        return;
      }
    }

    setThreadsState((prev) =>
      prev.map((thread) =>
        thread.id === threadId ? { ...thread, name: cleanedName } : thread,
      ),
    );

    setEditingThreadId(null);
  };

  // add
  const handleAddThread = async (name: string) => {
    const trimmedName = name.trim().slice(0, 40);
    if (!trimmedName) return;

    if (user) {
      try {
        const createdThread = await createThreadForUser(user.id, trimmedName);

        const mappedThread = {
          id: createdThread.id,
          name: createdThread.name,
          isArchived: createdThread.is_archived,
        };

        setThreadsState((prev) => [...prev, mappedThread]);
        selectThread(mappedThread.id);
        setEditingThreadId(null);
        setThreadIdPendingArchive(null);
        return;
      } catch (error) {
        console.error('Failed to create thread in Supabase', error);
        return;
      }
    }

    const newThread = {
      id: crypto.randomUUID(),
      name: trimmedName,
    };

    setThreadsState((prev) => [...prev, newThread]);
    selectThread(newThread.id);
    setEditingThreadId(null);
    setThreadIdPendingArchive(null);
  };

  // archive
  const handleArchiveThread = async (threadId: string) => {
    if (user) {
      try {
        await updateThreadArchiveForUser(threadId, true);
      } catch (error) {
        console.error('Failed to archive thread in Supabase', error);
        return;
      }
    }
    setThreadsState((prev) => {
      const updated = prev.map((thread) =>
        thread.id === threadId ? { ...thread, isArchived: true } : thread,
      );

      // if the archived thread was selected, choose a new one from the UPDATED list
      if (selectedThreadId === threadId) {
        const nextThread = updated.find((t) => !t.isArchived);

        selectThread(nextThread?.id ?? null);
      }

      return updated;
    });
    // Clear edit mode to avoid stale UI state
    setEditingThreadId(null);
    setThreadIdPendingArchive(null);
  };

  // request/confirm/cancel
  const requestArchiveThread = (threadId: string) => {
    const count = getCheckinsCount(threadId);
    if (count === 0) {
      handleArchiveThread(threadId);
      return;
    }
    setThreadIdPendingArchive(threadId);
  };

  // checkin submit
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const cleanedTitle = checkinTitle.trim();
    const cleanedNote = checkinNote.trim();

    if (!selectedThreadId || !cleanedTitle) return;

    if (user) {
      try {
        // save to database
        const createdCheckin = await createCheckinForUser(
          user.id,
          selectedThreadId,
          cleanedTitle,
          cleanedNote || undefined,
        );

        const mappedCheckin: Checkin = {
          id: createdCheckin.id,
          threadId: createdCheckin.thread_id,
          text: createdCheckin.text,
          note: createdCheckin.note ?? undefined,
          createdAt: new Date(createdCheckin.created_at).getTime(),
        };

        setCheckinsHistory((prev) => {
          const next = [...prev, mappedCheckin];
          checkinsHistoryRef.current = next;
          return next;
        });
      } catch (error) {
        console.error('Failed to create checkin in Supabase', error);
        // stop everything, if saving fails
        return;
      }
    } else {
      const newCheckin: Checkin = {
        id: crypto.randomUUID(),
        threadId: selectedThreadId,
        text: cleanedTitle,
        note: cleanedNote || undefined,
        createdAt: Date.now(),
      };

      setCheckinsHistory((prev) => {
        const next = [...prev, newCheckin];
        checkinsHistoryRef.current = next;
        return next;
      });
    }

    localStorage.setItem(LAST_THREAD_STORAGE_KEY, selectedThreadId);

    setCheckinTitle('');
    setCheckinNote('');
  };

  // UI DATA
  console.log(
    'LAST_THREAD_STORAGE_KEY:',
    localStorage.getItem(LAST_THREAD_STORAGE_KEY),
  );
  console.log('selectedThreadId:', selectedThreadId);
  console.log(
    'threadsState ids:',
    threadsState.map((thread) => thread.id),
  );
  console.log(
    'checkin thread ids:',
    checkinsHistory.map((checkin) => checkin.threadId),
  );

  const selectedThreadData =
    threadsState.find((thread) => thread.id === selectedThreadId) ?? null;

  console.log('selectedThreadData:', selectedThreadData);

  const selectedThreadCheckins = checkinsHistory
    .filter((checkin) => checkin.threadId === selectedThreadId)
    .sort((a, b) => b.createdAt - a.createdAt) // newest first;
    .slice(0, 6) // show only last 6;
    .reverse();

  const checkinsCountForSelectedThread = selectedThreadId
    ? getCheckinsCount(selectedThreadId)
    : 0;

  useEffect(() => {
    if (user) return; // authenticated users use real data, so seed checkins are guest-only
    if (!hasLoadedCheckins || !hasLoadedThreads) return;

    const currentThreadIds = new Set(threadsState.map((thread) => thread.id));

    const hasCheckinsForCurrentThreads = checkinsHistory.some((checkin) =>
      currentThreadIds.has(checkin.threadId),
    );

    // if current guest threads already have checkins, don't seed again
    if (hasCheckinsForCurrentThreads) return;

    const seedCheckins = createSeedCheckins(threadsState);
    if (seedCheckins.length === 0) return;

    setCheckinsHistory(() => {
      checkinsHistoryRef.current = seedCheckins;
      return seedCheckins;
    });
  }, [
    hasLoadedCheckins,
    hasLoadedThreads,
    checkinsHistory.length, // only re-run when it goes 0 -> >0 (or back)
    threadsState,
    setCheckinsHistory,
  ]);

  // Feature "Hero" start
  const gobackSectionRef = useRef<HTMLElement | null>(null);

  const [heroDismissed, setHeroDismissed] = useState(() => {
    return localStorage.getItem(HERO_DISMISSED_KEY) === 'true';
  });

  const handleShowIntro = () => {
    localStorage.removeItem(HERO_DISMISSED_KEY);
    setHeroDismissed(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showHero = !heroDismissed;

  const handleHeroDismiss = () => {
    localStorage.setItem(HERO_DISMISSED_KEY, 'true');
    setHeroDismissed(true);
  };

  const handleHeroCta = () => {
    gobackSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start', // aligns top of section with viewport top
    });
  };
  // Feature "Hero" end

  if (isCheckingAuth || (user && isBootstrappingAuthWorkspace)) {
    return (
      <>
        <Header heroDismissed={false} />
        <main className="page">
          <p>Loading...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header heroDismissed={heroDismissed} onShowIntro={handleShowIntro} />

      <main className="page">
        {showHero && !showLoginPrompt && (
          <Hero onCtaClick={handleHeroCta} onDismiss={handleHeroDismiss} />
        )}

        {showLoginPrompt ? (
          <LoginPrompt />
        ) : (
          <>
            <ThreadsTabs
              threads={threadsState}
              selectedThreadId={selectedThreadId}
              onSelectThread={handleThreadClick}
              onAddThread={handleAddThread}
            />

            <article className="panel goback-panel" ref={gobackSectionRef}>
              <GoBackCard
                isLoadingSelection={isBootstrappingAuthWorkspace}
                checkinsForSelectedThread={selectedThreadCheckins}
                selectedThread={selectedThreadData}
                checkinTitle={checkinTitle}
                checkinNote={checkinNote}
                onCheckinTitleChange={setCheckinTitle}
                onCheckinNoteChange={setCheckinNote}
                onSubmit={handleSubmit}
                editingThreadId={editingThreadId}
                onStartEditing={setEditingThreadId}
                onCancelEditing={() => setEditingThreadId(null)}
                onRenameConfirm={handleRenameConfirm}
                threadIdPendingArchive={threadIdPendingArchive}
                onRequestArchiveThread={requestArchiveThread}
                onConfirmArchiveThread={handleArchiveThread}
                onCancelArchiveThread={() => setThreadIdPendingArchive(null)}
                checkinsCountForSelectedThread={checkinsCountForSelectedThread}
              />
            </article>
          </>
        )}

        <div className="page-spacer" />

        <Footer></Footer>
      </main>
    </>
  );
};
