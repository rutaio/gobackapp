import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import '../styles/pages/about.css';
import stickyNote from '../assets/sticky-note.png';
import arrowCycle from '../assets/arrow-as-cycle.png';
import buckets from '../assets/chemistry-for-business.png';
import sea from '../assets/sea.jpg';

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

        <section id="how" className="panel about-section">
          <div className="grid about-grid">
            <div className="about-image">
              {' '}
              <img src={sea} alt="Sea of ideas" />
            </div>
            <div>
              <h2>The problem</h2>
              <p>
                For people who like to create, it gets harder to focus and do
                deep work.
              </p>
              <p>Our heads are full of ideas.</p>
            </div>
          </div>
        </section>

        <section id="step-1" className="panel about-section">
          <div className="grid about-grid">
            <div>
              <h2>Step 1: Map</h2>
              <p>
                It's easier to focus when ideas are grouped into "buckets" -
                areas of work. We call them activities.
              </p>
              <p>On GoBack, name a set of activities you want to keep alive.</p>
              <a href="#step-2" role="button" className="btn-primary">
                Next
              </a>
            </div>
            <div className="about-image">
              <img src={buckets} alt="Buckets of activities" />
            </div>
          </div>
        </section>

        <section id="step-2" className="panel about-section">
          <div className="grid about-grid">
            <div>
              <h2>Step 2: Work</h2>
              <p>
                It's more enjoyable to move forward when to-dos are broken down
                into small "chunks". We call them steps.
              </p>
              <p>On GoBack, pick one activity and log the next small step.</p>
              <a href="#step-3" role="button" className="btn-primary">
                Next
              </a>
            </div>
            <div className="about-image">
              <img
                src={stickyNote}
                alt="Sticky note as a symbol of a small step"
              />
            </div>
          </div>
        </section>

        <section id="step-3" className="panel about-section">
          <div className="grid about-grid">
            <div>
              <h2>Step 3: Come back</h2>
              <p>
                After a break, you don't start from scratch - you review recent
                steps, remember context and continue.
              </p>
              <a href="/" role="button" className="btn-primary">
                Start
              </a>
            </div>
            <div className="about-image">
              <img
                src={arrowCycle}
                alt="Arrow cycling back to the beginning of an activity"
              />
            </div>
          </div>
        </section>

        <section className="about-cta">
          <h2>Let's continue our activities.</h2>
          <a href="/" role="button" className="btn-primary">
            Go Back
          </a>
        </section>

        <Footer />
      </main>
    </>
  );
};
