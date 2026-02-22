//	If a function mutates global/shared state → it belongs in HomePage

import '../styles/pages/home.css';
import { threads } from '../data/threads';
import { useState } from 'react';
import { ThreadsList } from '../components/ThreadsList';
import { GoBackCard } from '../components/GoBackCard';
import type { Checkin } from '../types/types';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

import { useCheckinsStorage } from '../hooks/useCheckinsStorage';
import { useThreadsStorage } from '../hooks/useThreadsStorage';
import { useDefaultSelectedThread } from '../hooks/useDefaultSelectedThread';

const CHECKINS_STORAGE_KEY = 'goback_checkins_v1';
const THREADS_STORAGE_KEY = 'goback_threads_v1';
const LAST_THREAD_STORAGE_KEY = 'goback_last_thread_v1';

export const HomePage = () => {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [checkin, setCheckin] = useState('');
  const [threadIdPendingArchive, setThreadIdPendingArchive] = useState<
    string | null
  >(null);

  const { threadsState, setThreadsState, hasLoadedThreads } = useThreadsStorage(
    THREADS_STORAGE_KEY,
    threads,
  );

  const { checkinsHistory, setCheckinsHistory, hasLoadedCheckins } =
    useCheckinsStorage(CHECKINS_STORAGE_KEY);

  useDefaultSelectedThread(
    hasLoadedCheckins,
    hasLoadedThreads,
    selectedThreadId,
    setSelectedThreadId,
    checkinsHistory,
    threadsState,
    LAST_THREAD_STORAGE_KEY,
  );

  // HELPERS
  const getCheckinsCount = (threadId: string) =>
    checkinsHistory.filter((checkin) => checkin.threadId === threadId).length;

  // HANDLERS
  // thread selection
  const handleThreadClick = (threadId: string) => {
    setSelectedThreadId(threadId);
    setThreadIdPendingArchive(null); // close any pending archive confirm UI
  };

  // rename
  const handleRenameConfirm = (threadId: string, newName: string) => {
    const cleanedName = newName.trim();
    if (cleanedName === '') {
      setEditingThreadId(null);
      return;
    }

    setThreadsState((prev) =>
      prev.map((thread) =>
        thread.id === threadId ? { ...thread, name: cleanedName } : thread,
      ),
    );
    setEditingThreadId(null);
  };

  // add
  const handleAddThread = (name: string) => {
    const trimmedName = name.trim().slice(0, 40); // enforce max length
    if (!trimmedName) return;

    const newThread = {
      id: crypto.randomUUID(),
      name: trimmedName,
    };

    setThreadsState((prev) => [...prev, newThread]);
    // Nice UX: automatically open the new thread
    setSelectedThreadId(newThread.id);
    setEditingThreadId(null);
  };

  // archive
  const handleArchiveThread = (threadId: string) => {
    setThreadsState((prev) => {
      const updated = prev.map((thread) =>
        thread.id === threadId ? { ...thread, isArchived: true } : thread,
      );

      // if the archived thread was selected, choose a new one from the UPDATED list
      if (selectedThreadId === threadId) {
        const nextThread = updated.find((t) => !t.isArchived);

        setSelectedThreadId(nextThread?.id ?? null);
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
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanedCheckin = checkin.trim();
    if (!selectedThreadId || !cleanedCheckin) return;
    const newCheckin: Checkin = {
      id: crypto.randomUUID(),
      threadId: selectedThreadId,
      text: cleanedCheckin,
      createdAt: Date.now(),
    };
    // remember where user worked last
    localStorage.setItem(LAST_THREAD_STORAGE_KEY, selectedThreadId);
    setCheckinsHistory((prev) => [...prev, newCheckin]);
    setCheckin('');
  };

  // UI DATA
  const selectedThreadData =
    threadsState.find((thread) => thread.id === selectedThreadId) ?? null;

  const selectedThreadCheckins = checkinsHistory
    .filter((checkin) => checkin.threadId === selectedThreadId)
    .sort((a, b) => b.createdAt - a.createdAt) // newest first;
    .slice(0, 3) // show only last 3;
    .reverse();

  return (
    <>
      <Header></Header>

      <main className="page">
        <div className="dashboard">
          <article className="panel threads-panel">
            <ThreadsList
              threads={threadsState}
              selectedThreadId={selectedThreadId}
              onSelectThread={handleThreadClick}
              onStartEditing={setEditingThreadId}
              editingThreadId={editingThreadId}
              onRenameConfirm={handleRenameConfirm}
              onAddThread={handleAddThread}
              onRequestArchiveThread={requestArchiveThread}
              onConfirmArchiveThread={handleArchiveThread}
              onCancelArchiveThread={() => setThreadIdPendingArchive(null)}
              threadIdPendingArchive={threadIdPendingArchive}
              getCheckinsCount={getCheckinsCount}
            />
          </article>

          <article className="panel goback-panel">
            <GoBackCard
              checkinsForSelectedThread={selectedThreadCheckins}
              selectedThread={selectedThreadData}
              checkin={checkin}
              onCheckinChange={setCheckin}
              onSubmit={handleSubmit}
            />
          </article>
        </div>

        <div className="page-spacer" />

        <Footer></Footer>
      </main>
    </>
  );
};
