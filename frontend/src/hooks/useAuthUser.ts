import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabaseClient';

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setIsCheckingAuth(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsCheckingAuth(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, isCheckingAuth };
}
