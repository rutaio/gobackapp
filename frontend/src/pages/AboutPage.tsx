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
          <h1>GoBack is your accountability buddy.</h1>

          <p className="about-lead">Use this space to do deep work.</p>

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
            When you're self-directed and busy, the things that matter to you
            quietly disappear.
          </p>
          <ul className="about-problem-list">
            <li>You want to write, build, explore</li>
            <li>But your days fill with responsibilities</li>
            <li>And restarting feels heavier than continuing</li>
          </ul>
        </section>

        <section id="step-1" className="panel about-section">
          <div className="grid about-grid">
            <div>
              <h2>Step 1: Name</h2>
              <p>
                When everything competes for attention, boundaries create focus.
              </p>
              <p>
                On GoBack, name the activities you want to keep alive in your
                life.
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
              <p>Momentum comes from small visible steps.</p>
              <p>Pick one activity and log one small action.</p>
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

              <p>
                After a break, you don't start from zero. You start from memory.
              </p>
              <p>
                Review your recent steps, remember where you left off and
                continue.
              </p>
            </div>
            <div className="about-image">
              <img src={steps} alt="List of recent steps" />
            </div>
          </div>
        </section>

        <section className="about-cta">
          <h2>Make space for what matters.</h2>
          <a href="/" role="button" className="btn-primary">
            Go Back
          </a>
        </section>

        <Footer />
      </main>
    </>
  );
};
