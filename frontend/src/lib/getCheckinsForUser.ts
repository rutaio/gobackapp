import { supabase } from './supabaseClient';

export async function getCheckinsForUser(userId: string) {
  const { data, error } = await supabase
    .from('checkins')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return data;
}
