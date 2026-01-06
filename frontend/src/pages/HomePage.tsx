import '../styles/pages/home.css';
import { threads } from '../data/threads';
import { useState } from 'react';

export const HomePage = () => {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  const handleThreadClick = (threadId: string) => {
    console.log('Selected thread id:', threadId);
    setSelectedThreadId(threadId);
  };

  const selectedThreadData = threads.find(
    (thread) => thread.id === selectedThreadId
  );

  return (
    <div className="page">
      <div className="dashboard">
        <div className="panel">
          <h2>Threads</h2>
          <p>Your project work areas</p>
          <div>
            <ul>
              {threads.map((thread) => (
                <li
                  key={thread.id}
                  onClick={() => handleThreadClick(thread.id)}
                  className={thread.id === selectedThreadId ? 'selected' : ''}
                >
                  {thread.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="panel">
          <h2>Go Back</h2>
          <p>Continue from where you left off</p>
          <div className="card">
            {selectedThreadData ? (
              <>
                <p className="selected-thread">{selectedThreadData.name}</p>

                <div className="reflection-placeholder">
                  Reflection content goes here
                </div>
              </>
            ) : (
              <p>Select a thread to continue</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
