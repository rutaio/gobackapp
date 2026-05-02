import { LoginButton } from './LoginButton';

export const LoginPrompt = () => {
  return (
    <section className="panel login-prompt">
      <h2>Hello, user,</h2>
      <p>You already have an account. Log in to continue.</p>

      <div className="login-prompt__actions">
        <LoginButton />
      </div>
    </section>
  );
};
