import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export const LogoutButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout failed', error);
      setIsLoading(false);
    }
  };

  return (
    <button type="button" onClick={handleLogout} disabled={isLoading}>
      {isLoading ? 'Signing out...' : 'Logout'}
    </button>
  );
};
