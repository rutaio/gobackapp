import { Link } from 'react-router-dom';
import '../styles/components/header.css';

export const Header = () => {
  return (
    <header>
      <div className="logo">
        <strong>GoBack</strong>
        <small>Return. Remember. Continue.</small>
      </div>

      <nav>
        <Link to="/about">How it works</Link>
      </nav>
    </header>
  );
};
