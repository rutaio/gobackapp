import { supabase } from '../lib/supabaseClient';

export async function getThreadsForUser(userId: string) {
  const { data, error } = await supabase
    .from('threads')
    .select('*')
    .eq('user_id', userId)
    .eq('is_archived', false)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}
