import { useEffect, useState } from 'react';
import type { Checkin } from '../types/types';

export function useCheckinsStorage(storageKey: string, isEnabled: boolean) {
  const [checkinsHistory, setCheckinsHistory] = useState<Checkin[]>([]);
  const [hasLoadedCheckins, setHasLoadedCheckins] = useState(false);

  // load checkins
  useEffect(() => {
    if (!isEnabled) {
      setHasLoadedCheckins(false);

      return;
    }
    const savedCheckins = localStorage.getItem(storageKey);

    if (savedCheckins) {
      try {
        const parsedCheckins = JSON.parse(savedCheckins);
        setCheckinsHistory(parsedCheckins);
      } catch (error) {
        console.warn('Failed to parse saved checkins from localStorage', error);
        setCheckinsHistory([]);
      }
    } else {
      setCheckinsHistory([]);
    }

    setHasLoadedCheckins(true);
  }, [storageKey, isEnabled]);

  // save checkins
  useEffect(() => {
    if (!hasLoadedCheckins || !isEnabled) return;

    localStorage.setItem(storageKey, JSON.stringify(checkinsHistory));
  }, [checkinsHistory, hasLoadedCheckins, storageKey, isEnabled]);

  return {
    checkinsHistory,
    setCheckinsHistory,
    hasLoadedCheckins,
  };
}
