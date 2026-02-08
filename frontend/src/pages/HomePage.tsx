import '../styles/pages/home.css';
import { threads } from '../data/threads';
import { useState } from 'react';
import { ThreadsList } from '../components/ThreadsList';
import { GoBackCard } from '../components/GoBackCard';
import type { Checkin } from '../types/types';

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

  const handleThreadClick = (threadId: string) => {
    setSelectedThreadId(threadId);
  };

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

    // take previous array and create new array with new checkin
    setCheckinsHistory((prev) => [...prev, newCheckin]);
    setCheckin('');
  };

  const selectedThreadData =
    threadsState.find((thread) => thread.id === selectedThreadId) ?? null;

  const selectedThreadCheckins = checkinsHistory
    .filter((checkin) => checkin.threadId === selectedThreadId)
    .sort((a, b) => b.createdAt - a.createdAt) // newest first;
    .slice(0, 3) // show only last 3;
    .reverse();

  const handleRenameConfirm = (threadId: string, newName: string) => {
    const cleanedName = newName.trim();
    if (cleanedName === '') {
      // Do nothing and revert to old name
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

  return (
    <div className="page">
      <div className="dashboard">
        <div className="panel">
          <GoBackCard
            checkinsForSelectedThread={selectedThreadCheckins}
            selectedThread={selectedThreadData}
            checkin={checkin}
            onCheckinChange={setCheckin}
            onSubmit={handleSubmit}
          />
        </div>

        <div className="panel">
          <ThreadsList
            threads={threadsState}
            selectedThreadId={selectedThreadId}
            onSelectThread={handleThreadClick}
            onStartEditing={setEditingThreadId}
            editingThreadId={editingThreadId}
            onRenameConfirm={handleRenameConfirm}
          />
        </div>
      </div>
    </div>
  );
};
