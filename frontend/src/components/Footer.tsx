import { Link } from 'react-router-dom';
import '../styles/components/footer.css';

export const Footer = () => {
  return (
    <footer id="footer" className="container footer">
      <div className="footer-main">
        <div className="footer-meta">
          <small>
            Made by <a href="https://ruta.io">RUTA.io</a> ·{' '}
            <a href="mailto:hi@ruta.io">Give Feedback</a> ·{' '}
            <Link to="/privacy">Privacy</Link>
          </small>
        </div>

        <div className="footer-pitch">
          <small>
            GoBack helps creators continue their work. See where you left off.
            Take the next step.
          </small>
        </div>
      </div>
    </footer>
  );
};
