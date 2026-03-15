import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import '../styles/components/auth-button.css';

export const LoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);

      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            prompt: 'select_account',
          },
        },
      });
    } catch (error) {
      console.error('Google login failed', error);
      setIsLoading(false);
    }
  };

  return (
    <button
      className="auth-button"
      type="button"
      onClick={handleGoogleLogin}
      disabled={isLoading}
    >
      {isLoading ? 'Redirecting...' : 'Continue with Google'}
    </button>
  );
};
