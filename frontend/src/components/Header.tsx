import { Link, NavLink, useLocation } from 'react-router-dom';
import '../styles/components/header.css';
import { useState } from 'react';

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
      <Link to="/" className="logo">
        <strong>GoBack</strong>
        <small>Return · Remember · Continue</small>
      </Link>

      <button
        className="hamburger"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label="Menu"
      >
        ☰
      </button>

      <nav className={`header-nav ${isMenuOpen ? 'open' : ''}`}>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            `header-nav__link ${isActive ? 'is-active' : ''}`
          }
          onClick={() => setIsMenuOpen(false)}
        >
          How it works
        </NavLink>

        {shouldShowIntro && (
          <button
            type="button"
            className="header-nav__link"
            onClick={() => {
              onShowIntro?.();
              setIsMenuOpen(false);
            }}
          >
            Show intro
          </button>
        )}
      </nav>
    </header>
  );
};
