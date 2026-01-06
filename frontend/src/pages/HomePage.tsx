import '../styles/pages/home.css';
import { threads } from '../data/threads';

export const HomePage = () => {
  return (
    <div className="page">
      <div className="dashboard">
        <div className="panel">
          <h2>Threads</h2>
          <p>Your project work areas</p>
          <div>
            <ul>
              {threads.map((thread) => (
                <li key={thread.id}>{thread.name}</li>
              ))}
            </ul>
          </div>
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
