import { useEffect, useRef, useState } from 'react';
import type { Thread } from '../types/types';

export function useThreadsStorage(
  storageKey: string,
  fallbackThreads: Thread[],
  isEnabled: boolean,
) {
  const [threadsState, setThreadsState] = useState<Thread[]>(fallbackThreads);
  const [hasLoadedThreads, setHasLoadedThreads] = useState(false);
  const skipNextSaveRef = useRef(false);

  // load threads from localStorage only in guest mode
  useEffect(() => {
    if (!isEnabled) {
      setHasLoadedThreads(false);
      return;
    }

    skipNextSaveRef.current = true;

    const savedThreads = localStorage.getItem(storageKey);

    if (savedThreads) {
      try {
        const parsedThreads = JSON.parse(savedThreads);
        setThreadsState(parsedThreads);
      } catch (error) {
        console.warn('Failed to parse saved threads from localStorage', error);
        setThreadsState(fallbackThreads);
      }
    } else {
      setThreadsState(fallbackThreads);
    }

    setHasLoadedThreads(true);
  }, [storageKey, fallbackThreads, isEnabled]);

  // save threads to localStorage only in guest mode
  useEffect(() => {
    if (!hasLoadedThreads || !isEnabled) return;

    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    localStorage.setItem(storageKey, JSON.stringify(threadsState));
  }, [threadsState, hasLoadedThreads, storageKey, isEnabled]);

  return {
    threadsState,
    setThreadsState,
    hasLoadedThreads,
  };
}
