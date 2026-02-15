import type { Thread, Checkin } from '../types/types';
import '../styles/components/go-back-card.css';

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
      <h2>Steps</h2>
      <p>Log small actions to keep this thread alive.</p>
      <div className="card" data-testid="go-back-card">
        {selectedThread ? (
          <>
            <h4 className="selected-thread" data-testid="selected-thread-name">
              {selectedThread.name}
            </h4>

            <div className="checkins-history" data-testid="checkins-history">
              <p className="checkins-label">Recent steps:</p>

              {checkinsForSelectedThread.length === 0 ? (
                <p className="empty-state">
                  No steps yet. Start by adding one small action.
                </p>
              ) : (
                <ul>
                  {checkinsForSelectedThread.map((checkin) => (
                    <li key={checkin.id}>{checkin.text}</li>
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
                <button data-testid="save-checkin-button">
                  Save and continue
                </button>
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
