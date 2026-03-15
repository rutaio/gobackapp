import { supabase } from './supabaseClient';

export async function createThreadForUser(userId: string, name: string) {
  const { data, error } = await supabase
    .from('threads')
    .insert([
      {
        user_id: userId,
        name,
        is_archived: false,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}
