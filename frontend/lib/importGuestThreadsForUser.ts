import { supabase } from './supabaseClient';
import type { Thread } from '../src/types/types';

type ThreadIdMap = Record<string, string>;

export async function importGuestThreadsForUser(
  userId: string,
  guestThreads: Thread[],
) {
  const threadIdMap: ThreadIdMap = {};

  for (const guestThread of guestThreads) {
    const { data, error } = await supabase
      .from('threads')
      .insert([
        {
          user_id: userId,
          name: guestThread.name,
          is_archived: guestThread.isArchived ?? false,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    threadIdMap[guestThread.id] = data.id;
  }

  return threadIdMap;
}
