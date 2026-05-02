import { supabase } from './supabaseClient';

export async function updateThreadArchiveForUser(
  threadId: string,
  isArchived: boolean,
) {
  const { error } = await supabase
    .from('threads')
    .update({ is_archived: isArchived })
    .eq('id', threadId);

  if (error) throw error;
}