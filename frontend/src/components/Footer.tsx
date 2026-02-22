import '../styles/components/footer.css';

export const Footer = () => {
  return (
    <footer id="footer" className="container footer">
      <div className="footer-main">
        <div className="footer-meta">
          <small>
            Made by <a href="https://ruta.io">ruta.io</a> · Feedback welcome
          </small>
        </div>

        <div className="footer-pitch">
          <small>GoBack helps creators continue their work. See where you left off.
            Take the next step.</small>
        </div>
      </div>
    </footer>
  );
};
