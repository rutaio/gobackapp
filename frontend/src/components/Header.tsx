import { Link, NavLink, useLocation } from 'react-router-dom';
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
      <Link to="/" className="logo">
        <strong>GoBack</strong>
        <small>Return · Remember · Continue</small>
      </Link>

      <nav className="header-nav">
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `header-nav__link ${isActive ? 'is-active' : ''}`
          }
        >
          How it works
        </NavLink>

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
