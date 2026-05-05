import { Link } from 'react-router-dom';
import { LoginButton } from './LoginButton';
import '../styles/components/login-prompt.css';

export const LoginPrompt = () => {
  return (
    <section className="panel login-prompt">
      <p className="login-prompt__eyebrow">Your workspace is waiting</p>

      <h1>Welcome back</h1>

      <p className="login-prompt__lead">
        Log in to continue your threads and check-ins across devices.
      </p>

      <div className="login-prompt__actions">
        <LoginButton />
      </div>

      <p className="login-prompt__note">
        Learn how your data is handled in {' '}
        <Link to="/privacy">Privacy page</Link>.
      </p>
    </section>
  );
};
