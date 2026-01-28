const CHECKINS_STORAGE_KEY = 'goback_checkins_v1';
const THREADS_STORAGE_KEY = 'goback_threads_v1';
const LAST_THREAD_STORAGE_KEY = 'goback_last_thread_v1';

import '../styles/pages/home.css';
import { threads } from '../data/threads';
import { useEffect, useState } from 'react';
import { ThreadsList } from '../components/ThreadsList';
import { GoBackCard } from '../components/GoBackCard';
import type { Checkin } from '../types/types';

export const HomePage = () => {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [checkin, setCheckin] = useState('');
  const [checkinsHistory, setCheckinsHistory] = useState<Checkin[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [threadsState, setThreadsState] = useState(threads);
  const [hasLoadedThreads, setHasLoadedThreads] = useState(false);

  const handleThreadClick = (threadId: string) => {
    setSelectedThreadId(threadId);
    localStorage.setItem(LAST_THREAD_STORAGE_KEY, threadId);
  };

  const selectedThreadData =
    threadsState.find((thread) => thread.id === selectedThreadId) ?? null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedThreadId || !checkin) return;

    const newCheckin: Checkin = {
      id: crypto.randomUUID(),
      threadId: selectedThreadId,
      text: checkin,
      createdAt: Date.now(),
    };

    // remember where user worked last
    localStorage.setItem(LAST_THREAD_STORAGE_KEY, selectedThreadId);

    // take previous array and create new array with new checkin
    setCheckinsHistory((prev) => [...prev, newCheckin]);
    setCheckin('');
  };

  const selectedThreadCheckins = checkinsHistory.filter(
    (checkin) => checkin.threadId === selectedThreadId,
  );

  const handleRenameConfirm = (threadId: string, newName: string) => {
    const cleanedName = newName.trim();
    if (cleanedName === '') {
      // Do nothing and revert to old name
      setEditingThreadId(null);
      return;
    }

    setThreadsState((prev) =>
      prev.map((thread) =>
        thread.id === threadId ? { ...thread, name: newName } : thread,
      ),
    );
    setEditingThreadId(null);
  };

  // load threads from localStorage
  useEffect(() => {
    const savedThreads = localStorage.getItem(THREADS_STORAGE_KEY);

    if (savedThreads) {
      try {
        const parsedThreads = JSON.parse(savedThreads);
        setThreadsState(parsedThreads);
      } catch (error) {
        console.warn('Failed to parse saved threads from localStorage', error);
        setThreadsState(threads);
      }
    }

    setHasLoadedThreads(true);
  }, []);

  // save edited threads to localStorage
  useEffect(() => {
    if (!hasLoadedThreads) return;

    localStorage.setItem(THREADS_STORAGE_KEY, JSON.stringify(threadsState));
  }, [threadsState, hasLoadedThreads]);

  // to load checkins
  useEffect(() => {
    const savedCheckins = localStorage.getItem(CHECKINS_STORAGE_KEY);

    if (savedCheckins) {
      try {
        const parsedCheckins = JSON.parse(savedCheckins);
        setCheckinsHistory(parsedCheckins);
      } catch (error) {
        console.warn('Failed to parse saved checkins from localStorage', error);
        setCheckinsHistory([]);
      }
    }

    setHasLoaded(true);
  }, []);

  // to save checkins
  useEffect(() => {
    if (!hasLoaded) return;

    localStorage.setItem(CHECKINS_STORAGE_KEY, JSON.stringify(checkinsHistory));
  }, [checkinsHistory, hasLoaded]);

  // set default selected thread
  useEffect(() => {
    if (!hasLoaded || !hasLoadedThreads) return;
    if (selectedThreadId) return;

    const lastThreadId = localStorage.getItem(LAST_THREAD_STORAGE_KEY);

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
    hasLoaded,
    hasLoadedThreads,
    selectedThreadId,
    checkinsHistory,
    threadsState,
  ]);

  return (
    <div className="page">
      <div className="dashboard">
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

        <div className="panel">
          <GoBackCard
            checkinsForSelectedThread={selectedThreadCheckins}
            selectedThread={selectedThreadData}
            checkin={checkin}
            onCheckinChange={setCheckin}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};
