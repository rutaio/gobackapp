import { supabase } from './supabaseClient';
import type { Checkin } from '../src/types/types';

export async function importGuestCheckinsForUser(
  userId: string,
  checkins: Checkin[],
  threadIdMap: Record<string, string>,
) {
  const rows = checkins
    .filter((checkin) => threadIdMap[checkin.threadId])
    .map((checkin) => ({
      user_id: userId,
      thread_id: threadIdMap[checkin.threadId],
      text: checkin.text,
      note: checkin.note ?? null,
      created_at: new Date(checkin.createdAt).toISOString(),
    }));

  if (rows.length === 0) return;

  const { error } = await supabase.from('checkins').insert(rows);

  if (error) {
    throw error;
  }
}
