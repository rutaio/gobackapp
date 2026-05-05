import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import '../styles/components/auth-button.css';
import { Link } from 'react-router-dom';

export const LoginButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);

      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
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
    <div>
      <button
        className="auth-button"
        type="button"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        {isLoading ? 'Redirecting...' : 'Continue with Google'}
      </button>
    </div>
  );
};
