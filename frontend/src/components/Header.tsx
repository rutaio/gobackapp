import { Link, useLocation } from 'react-router-dom';
import '../styles/components/header.css';

type HeaderProps = {
  heroDismissed?: boolean;
  onShowIntro?: () => void;
};

export const Header = ({ heroDismissed = false, onShowIntro }: HeaderProps) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const shouldShowIntro = isHome && heroDismissed;

  return (
    <header>
      <div className="logo">
        <strong>GoBack</strong>
        <small>Return. Remember. Continue.</small>
      </div>

      <nav className="header-nav">
        <Link className="header-nav__link" to="/about">
          How it works
        </Link>

        {shouldShowIntro && (
          <button
            type="button"
            className="header-nav__link"
            onClick={onShowIntro}
          >
            Show intro
          </button>
        )}
      </nav>
    </header>
  );
};
