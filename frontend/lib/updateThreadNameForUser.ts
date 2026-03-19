import { supabase } from './supabaseClient';

export async function updateThreadNameForUser(
  threadId: string,
  newName: string,
) {
  const { error } = await supabase
    .from('threads')
    .update({ name: newName })
    .eq('id', threadId);

  if (error) {
    throw error;
  }
}