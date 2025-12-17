import '../styles/pages/home.css';

export const HomePage = () => {
  return (
    <div className="page">
      <div className="dashboard">
        <div className="panel">
          <h2>Threads</h2>
          <p>Your project work areas</p>
          <div>Threads list goes here</div>
        </div>
        <div className="panel">
          <h2>Go Back</h2>
          <p>Continue from where you left off</p>
          <div>Checkin card goes here</div>
        </div>
      </div>
    </div>
  );
};
