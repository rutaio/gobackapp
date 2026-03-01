import '../styles/components/hero.css';

type HeroProps = {
  onCtaClick: () => void;
  onDismiss: () => void;
};

export const Hero = ({ onCtaClick, onDismiss }: HeroProps) => {
  return (
    <section className="hero" data-testid="home-hero">
      <h1>
        Continue your projects,<br></br> without chaos.
      </h1>
      <p className="hero-lead">Log small steps. Pick up where you left off.</p>

      <div className="hero-actions">
        <button type="button" className="btn-primary" onClick={onCtaClick}>
          Add your first step
        </button>

        <button
          type="button"
          className="hero-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss intro"
        >
          Dismiss
        </button>
      </div>
    </section>
  );
};
