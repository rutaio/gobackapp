import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import '../styles/pages/about.css';

export const PrivacyPage = () => {
  return (
    <>
      <Header />

      <main className="page about">
        <section className="panel about-section">
          <h1>Privacy Policy</h1>

          <p className="about-lead">How your data is handled in GoBack</p>

          <p>
            GoBack stores your activity data so you can continue what you
            started.
          </p>

          <p>
            When you log in, your threads and check-ins are saved using{' '}
            <a href="https://supabase.com/">Supabase</a>. This allows your data
            to persist across sessions and devices.
          </p>

          <p>
            Your data is protected between users using Supabase Row Level
            Security (RLS), meaning each user can only access their own data
            within the application.
          </p>

          <p>
            At the same time, as the application owner, administrative-level
            access to the database is technically possible.
          </p>

          <p>
            This is an early version of the app. Additional privacy
            improvements, such as application-level or end-to-end encryption,
            may be introduced in future versions.
          </p>

          <p>
            If you have any questions about how your data is handled, feel free
            to <a href="mailto:hi@ruta.io">reach out</a>.
          </p>
        </section>

        <Footer />
      </main>
    </>
  );
};
