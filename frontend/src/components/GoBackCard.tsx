import type { Thread, Checkin } from '../types/types';
import '../styles/components/go-back-card.css';
import { useState } from 'react';

interface GoBackCardProps {
  selectedThread: Thread | null;
  checkinTitle: string;
  checkinNote: string;
  onCheckinTitleChange: (value: string) => void;
  onCheckinNoteChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  checkinsForSelectedThread: Checkin[];
}

/* HELPER - controls UI expand/collapse for ONE list item. */
const CheckinListItem = ({ checkin }: { checkin: Checkin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasNote = Boolean(checkin.note?.trim());

  const toggle = () => setIsOpen((v) => !v);

  return (
    <li>
      {hasNote ? (
        <button
          type="button"
          className={`checkin-title checkin-title--clickable ${
            isOpen ? 'is-open' : ''
          }`}
          onClick={toggle}
          aria-expanded={isOpen}
        >
          <span className="checkin-title-text">{checkin.text}</span>
          <span className="checkin-chevron" aria-hidden="true">
            ▾
          </span>
        </button>
      ) : (
        <div className="checkin-title">{checkin.text}</div>
      )}

      {hasNote && isOpen && (
        <div className="checkin-note" data-testid="checkin-note">
          {checkin.note}
        </div>
      )}
    </li>
  );
};

export const GoBackCard = ({
  selectedThread,
  checkinTitle,
  onCheckinTitleChange,
  checkinNote,
  onCheckinNoteChange,
  onSubmit,
  checkinsForSelectedThread,
}: GoBackCardProps) => {
  return (
    <>
      <h2>Steps</h2>
      <p>Log small steps you take.</p>
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
                  No steps yet. Start by adding one.
                </p>
              ) : (
                <ul>
                  {checkinsForSelectedThread.map((checkin) => (
                    <CheckinListItem key={checkin.id} checkin={checkin} />
                  ))}
                </ul>
              )}
            </div>

            <div className="checkin-card">
              <form onSubmit={onSubmit} className="form">
                <input
                  data-testid="checkin-title-input"
                  className="checkin-title-input"
                  id="checkin-title"
                  value={checkinTitle}
                  required
                  placeholder="What small step will keep this alive?"
                  onChange={(e) => onCheckinTitleChange(e.target.value)}
                />

                <textarea
                  data-testid="checkin-note-input"
                  className="checkin-note-input"
                  id="checkin-note"
                  rows={3}
                  value={checkinNote}
                  placeholder="Notes (optional)"
                  onChange={(e) => onCheckinNoteChange(e.target.value)}
                />

                <button data-testid="save-checkin-button">
                  Save and continue
                </button>
              </form>
            </div>
          </>
        ) : (
          <p>Select an activity to continue</p>
        )}
      </div>
    </>
  );
};
