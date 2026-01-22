const CHECKINS_STORAGE_KEY = 'goback_checkins_v1';

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

  const handleThreadClick = (threadId: string) => {
    console.log('Selected thread id:', threadId);
    setSelectedThreadId(threadId);
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

    // take previous array and create new array with new checkin
    setCheckinsHistory((prev) => [...prev, newCheckin]);
    setCheckin('');
  };

  const selectedThreadCheckins = checkinsHistory.filter(
    (checkin) => checkin.threadId === selectedThreadId,
  );

  const handleRenameConfirm = (threadId: string, newName: string) => {
    setThreadsState((prev) =>
      prev.map((thread) =>
        thread.id === threadId ? { ...thread, name: newName } : thread,
      ),
    );
    setEditingThreadId(null);
  };

  // to load
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

  // to save
  useEffect(() => {
    if (!hasLoaded) return;

    localStorage.setItem(CHECKINS_STORAGE_KEY, JSON.stringify(checkinsHistory));
  }, [checkinsHistory, hasLoaded]);

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
