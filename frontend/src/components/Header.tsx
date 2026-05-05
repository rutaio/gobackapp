import { Link, NavLink, useLocation } from 'react-router-dom';
import '../styles/components/header.css';
import { useState } from 'react';
import { AuthButton } from './AuthButton';

type HeaderProps = {
  heroDismissed?: boolean;
  onShowIntro?: () => void;
};

export const Header = ({ heroDismissed = false, onShowIntro }: HeaderProps) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const shouldShowIntro = isHome && heroDismissed;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header>
      {isHome ? (
        <div className="logo logo--static">
          <strong>GoBack</strong>
          <small>Return · Remember · Continue</small>
        </div>
      ) : (
        <Link to="/" className="logo">
          <strong>GoBack</strong>
          <small>Return · Remember · Continue</small>
        </Link>
      )}

      <button
        className="hamburger"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label="Menu"
      >
        ☰
      </button>

      <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
        {shouldShowIntro && (
          <button
            type="button"
            className="header-nav__link"
            onClick={() => {
              onShowIntro?.();
              setIsMenuOpen(false);
            }}
          >
            Show Intro
          </button>
        )}

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `header-nav__link ${isActive ? 'is-active' : ''}`
          }
          onClick={() => setIsMenuOpen(false)}
        >
          About
        </NavLink>

        <NavLink
          to="/privacy"
          className={({ isActive }) =>
            `header-nav__link ${isActive ? 'is-active' : ''}`
          }
          onClick={() => setIsMenuOpen(false)}
        >
          Privacy
        </NavLink>
      </nav>

      <AuthButton />
    </header>
  );
};
