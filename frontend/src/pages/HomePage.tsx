import '../styles/pages/home.css';
import { threads } from '../data/threads';
import { useState } from 'react';
import { ThreadsList } from '../components/ThreadsList';

export const HomePage = () => {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [checkin, setCheckin] = useState('');

  const handleThreadClick = (threadId: string) => {
    console.log('Selected thread id:', threadId);
    setSelectedThreadId(threadId);
  };

  const selectedThreadData = threads.find(
    (thread) => thread.id === selectedThreadId
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({
      threadId: selectedThreadId,
      text: checkin,
    });
    setCheckin('');
  };

  return (
    <div className="page">
      <div className="dashboard">
        <div className="panel">
          {' '}
          <ThreadsList
            threads={threads}
            selectedThreadId={selectedThreadId}
            onSelectThread={handleThreadClick}
          />
        </div>

        <div className="panel">
          <h2>Go Back</h2>
          <p>Continue from where you left off</p>
          <div className="card">
            {selectedThreadData ? (
              <>
                <p className="selected-thread">{selectedThreadData.name}</p>

                <div className="checkin-card">
                  <form onSubmit={handleSubmit} className="form">
                    <textarea
                      id="checkin"
                      rows={4}
                      value={checkin}
                      required
                      placeholder="Now, I will take a small step in..."
                      onChange={(event) => setCheckin(event.target.value)}
                    />
                    <button>Save and continue</button>
                  </form>
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
