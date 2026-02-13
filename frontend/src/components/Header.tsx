import '../styles/components/header.css';

export const Header = () => {
  return (
    <header>
      <div className="logo">
        <strong>GoBack</strong>
        <small>Return. Remember. Continue.</small>
      </div>

      <nav>
        <a href="#footer">How it works</a>
      </nav>
    </header>
  );
};
