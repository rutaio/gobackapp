import { useState } from 'react';
import type { Checkin } from '../types/types';
import { formatRelativeTime } from '../utils/formatRelativeTime';

const CheckinListItem = ({ checkin }: { checkin: Checkin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasNote = Boolean(checkin.note?.trim());

  const relative = formatRelativeTime(checkin.createdAt);

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

          <span className="checkin-meta">
            <span className="checkin-time">{relative}</span>
            <span className="checkin-chevron" aria-hidden="true">
              ▾
            </span>
          </span>
        </button>
      ) : (
        <div className="checkin-title">
          <span className="checkin-title-text">{checkin.text}</span>
          <span className="checkin-time">{relative}</span>
        </div>
      )}

      {hasNote && isOpen && (
        <div className="checkin-note" data-testid="checkin-note">
          {checkin.note}
        </div>
      )}
    </li>
  );
};

type CheckinsHistoryProps = {
  checkins: Checkin[];
};

export const CheckinsHistory = ({ checkins }: CheckinsHistoryProps) => {
  return (
    <div className="checkins-history" data-testid="checkins-history">
      <p className="checkins-label">Recent steps:</p>

      {checkins.length === 0 ? (
        <p className="empty-state">No steps yet. Start by adding one.</p>
      ) : (
        <ul>
          {checkins.map((checkin) => (
            <CheckinListItem key={checkin.id} checkin={checkin} />
          ))}
        </ul>
      )}
    </div>
  );
};
