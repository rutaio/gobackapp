import type { Thread, Checkin } from '../types/types';

interface GoBackCardProps {
  selectedThread: Thread | null;
  checkin: string;
  onCheckinChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  checkinsForSelectedThread: Checkin[];
}

export const GoBackCard = ({
  selectedThread,
  checkin,
  onCheckinChange,
  onSubmit,
  checkinsForSelectedThread,
}: GoBackCardProps) => {
  return (
    <>
      <h2>Go Back</h2>
      <p>Continue from where you left off.</p>
      <div className="card">
        {selectedThread ? (
          <>
            <p className="selected-thread">{selectedThread.name}</p>

            <div className="checkins-history">
              {checkinsForSelectedThread.length === 0 ? (
                <p>No check-ins yet</p>
              ) : (
                <ul>
                  <p className="checkins-label">Last time you did:</p>
                  {checkinsForSelectedThread.map((checkin) => (
                    <li key={checkin.id} className="history-item">
                      {checkin.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="checkin-card">
              <form onSubmit={onSubmit} className="form">
                <textarea
                  id="checkin"
                  rows={4}
                  value={checkin}
                  required
                  placeholder="What small step will keep this alive now?"
                  onChange={(event) => onCheckinChange(event.target.value)}
                />
                <button>Save and continue</button>
              </form>
            </div>
          </>
        ) : (
          <p>Select a thread to continue</p>
        )}
      </div>
    </>
  );
};
