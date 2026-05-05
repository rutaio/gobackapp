import { supabase } from './supabaseClient';

export async function createCheckinForUser(
  userId: string,
  threadId: string,
  text: string,
  note?: string,
) {
  const { data, error } = await supabase
    .from('checkins')
    .insert({
      user_id: userId,
      thread_id: threadId,
      text,
      note: note ?? null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
