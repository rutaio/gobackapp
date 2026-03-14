import { LoginButton } from './LoginButton';
import { LogoutButton } from './LogoutButton';
import { useAuthUser } from '../hooks/useAuthUser';

export const AuthButton = () => {
  const { user, isCheckingAuth } = useAuthUser();

  if (isCheckingAuth) {
    return <p>Checking auth...</p>;
  }

  return user ? <LogoutButton /> : <LoginButton />;
};
