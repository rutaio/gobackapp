import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import '../styles/pages/about.css';
import steps from '../assets/steps.png';
import activities from '../assets/activities.png';
import checkin from '../assets/checkin.png';

export const AboutPage = () => {
  return (
    <>
      <Header />

      <main className="page about">
        <section className="about-hero">
          <h1>Go Back is your place to do deep work.</h1>
          <p className="about-lead">Review. Remember. Continue.</p>
          <div className="about-actions">
            <a href="#how" role="button" className="btn-primary">
              Show me
            </a>
            <a href="/" className="btn-primary" role="button">
              Go to app
            </a>
          </div>
        </section>

        <section id="how" className="panel about-section about-problem">
          <h2>The problem</h2>
          <p className="about-lead">
            When you're juggling ideas and responsibilities, it's easy to lose
            your place.
          </p>

          <ul className="about-problem-list">
            <li>You stop for a few days and forget where you left off</li>
            <li>Work gets scattered across notes, tabs and to-dos</li>
            <li>Restarting feels heavier than continuing</li>
          </ul>
        </section>

        <section id="step-1" className="panel about-section">
          <div className="grid about-grid">
            <div>
              <h2>Step 1: Name</h2>
              <p>It's easier to focus when your work has clear boundaries.</p>
              <p>
                On GoBack, name the activities you want to keep moving forward.
              </p>
            </div>
            <div className="about-image">
              <img src={activities} alt="A list of activities" />
            </div>
          </div>
        </section>

        <section id="step-2" className="panel about-section">
          <div className="grid about-grid">
            <div>
              <h2>Step 2: Focus</h2>
              <p>Progress feels lighter when it's broken into small steps.</p>
              <p>Pick one activity and write the next small thing you'll do.</p>
            </div>
            <div className="about-image">
              <img src={checkin} alt="Checkin form" />
            </div>
          </div>
        </section>

        <section id="step-3" className="panel about-section">
          <div className="grid about-grid">
            <div>
              <h2>Step 3: Come back</h2>

              <p>After a break, you don't start from scratch.</p>
              <p>
                Review your recent steps, remember the context and continue.
              </p>
            </div>
            <div className="about-image">
              <img src={steps} alt="List of recent steps" />
            </div>
          </div>
        </section>

        <section className="about-cta">
          <h2>Let's continue where you left off.</h2>
          <a href="/" role="button" className="btn-primary">
            Go Back
          </a>
        </section>

        <Footer />
      </main>
    </>
  );
};
