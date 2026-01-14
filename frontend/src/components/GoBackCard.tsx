import type { Thread } from '../types/types';

interface GoBackCardProps {
  selectedThread: Thread | null;
  checkin: string;
  onCheckinChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export const GoBackCard = ({
  selectedThread,
  checkin,
  onCheckinChange,
  onSubmit,
}: GoBackCardProps) => {
  return (
    <>
      <h2>Go Back</h2>
      <p>Continue from where you left off</p>
      <div className="card">
        {selectedThread ? (
          <>
            <p className="selected-thread">{selectedThread.name}</p>

            <div className="checkin-card">
              <form onSubmit={onSubmit} className="form">
                <textarea
                  id="checkin"
                  rows={4}
                  value={checkin}
                  required
                  placeholder="Now, I will take a small step in..."
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
