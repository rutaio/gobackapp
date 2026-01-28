import { useEffect, useState } from 'react';
import type { Checkin } from '../types/types';

export function useCheckinsStorage(storageKey: string) {
  const [checkinsHistory, setCheckinsHistory] = useState<Checkin[]>([]);
  const [hasLoadedCheckins, setHasLoadedCheckins] = useState(false);

  // load checkins
  useEffect(() => {
    const savedCheckins = localStorage.getItem(storageKey);

    if (savedCheckins) {
      try {
        const parsedCheckins = JSON.parse(savedCheckins);
        setCheckinsHistory(parsedCheckins);
      } catch (error) {
        console.warn('Failed to parse saved checkins from localStorage', error);
        setCheckinsHistory([]);
      }
    }

    setHasLoadedCheckins(true);
  }, [storageKey]);

  // save checkins
  useEffect(() => {
    if (!hasLoadedCheckins) return;

    localStorage.setItem(storageKey, JSON.stringify(checkinsHistory));
  }, [checkinsHistory, hasLoadedCheckins, storageKey]);

  return {
    checkinsHistory,
    setCheckinsHistory,
    hasLoadedCheckins,
  };
}
