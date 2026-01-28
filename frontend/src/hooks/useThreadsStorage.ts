import { useEffect, useState } from 'react';
import type { Thread } from '../types/types';

export function useThreadsStorage(
  storageKey: string,
  fallbackThreads: Thread[],
) {
  const [threadsState, setThreadsState] = useState<Thread[]>(fallbackThreads);
  const [hasLoadedThreads, setHasLoadedThreads] = useState(false);

  // load threads from localStorage
  useEffect(() => {
    const savedThreads = localStorage.getItem(storageKey);

    if (savedThreads) {
      try {
        const parsedThreads = JSON.parse(savedThreads);
        setThreadsState(parsedThreads);
      } catch (error) {
        console.warn('Failed to parse saved threads from localStorage', error);
        setThreadsState(fallbackThreads);
      }
    }

    setHasLoadedThreads(true);
  }, [storageKey, fallbackThreads]);

  // save edited threads to localStorage
  useEffect(() => {
    if (!hasLoadedThreads) return;

    localStorage.setItem(storageKey, JSON.stringify(threadsState));
  }, [threadsState, hasLoadedThreads, storageKey]);

  return {
    threadsState,
    setThreadsState,
    hasLoadedThreads,
  };
}
