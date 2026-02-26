import '../styles/components/go-back-card.css';
import { useState } from 'react';
import type { Thread, Checkin } from '../types/types';

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

interface GoBackCardProps {
  selectedThread: Thread | null;

  checkinTitle: string;
  checkinNote: string;
  onCheckinTitleChange: (value: string) => void;
  onCheckinNoteChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  checkinsForSelectedThread: Checkin[];

  // rename
  editingThreadId: string | null;
  onStartEditing: (threadId: string) => void;
  onCancelEditing: () => void;
  onRenameConfirm: (threadId: string, newName: string) => void;

  // archive
  threadIdPendingArchive: string | null;
  onRequestArchiveThread: (threadId: string) => void;
  onConfirmArchiveThread: (threadId: string) => void;
  onCancelArchiveThread: () => void;

  checkinsCountForSelectedThread: number;
}

export const GoBackCard = ({
  selectedThread,
  checkinTitle,
  onCheckinTitleChange,
  checkinNote,
  onCheckinNoteChange,
  onSubmit,
  checkinsForSelectedThread,

  editingThreadId,
  onStartEditing,
  onCancelEditing,
  onRenameConfirm,

  threadIdPendingArchive,
  onRequestArchiveThread,
  onConfirmArchiveThread,
  onCancelArchiveThread,

  checkinsCountForSelectedThread,
}: GoBackCardProps) => {
  const [draftName, setDraftName] = useState('');

  const isEditingSelected =
    !!selectedThread && editingThreadId === selectedThread.id;

  const isPendingArchiveSelected =
    !!selectedThread && threadIdPendingArchive === selectedThread.id;

  const handleRenameSave = () => {
    if (!selectedThread) return;
    onRenameConfirm(selectedThread.id, draftName);
  };

  const handleRenameCancel = () => {
    // reset draft back to current name
    setDraftName(selectedThread?.name ?? '');
    onCancelEditing();
  };

  return (
    <div className="card" data-testid="go-back-card">
      {selectedThread ? (
        <>
          <div className="selected-thread-row">
            {!isEditingSelected ? (
              <>
                <h4
                  className="selected-thread"
                  data-testid="selected-thread-name"
                >
                  {selectedThread.name}
                </h4>

                <div className="selected-thread-actions">
                  <button
                    type="button"
                    className="thread-action"
                    aria-label="Rename activity"
                    title="Rename"
                    onClick={() => {
                      // set draft BEFORE entering edit mode
                      setDraftName(selectedThread.name);
                      onStartEditing(selectedThread.id);
                    }}
                  >
                    ✏️
                  </button>

                  {!isPendingArchiveSelected ? (
                    <button
                      type="button"
                      className="thread-action"
                      aria-label="Archive activity"
                      title={
                        checkinsCountForSelectedThread > 0
                          ? 'Archive (requires confirmation)'
                          : 'Archive'
                      }
                      onClick={() => onRequestArchiveThread(selectedThread.id)}
                    >
                      🗑️
                    </button>
                  ) : (
                    <span className="thread-archive-confirm">
                      <span className="thread-archive-text">Archive?</span>

                      <button
                        type="button"
                        className="thread-action"
                        aria-label="Confirm archive"
                        title="Confirm"
                        onClick={() =>
                          onConfirmArchiveThread(selectedThread.id)
                        }
                      >
                        ✓
                      </button>

                      <button
                        type="button"
                        className="thread-action"
                        aria-label="Cancel archive"
                        title="Cancel"
                        onClick={onCancelArchiveThread}
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <input
                  className="selected-thread-rename"
                  value={draftName}
                  maxLength={40}
                  autoFocus
                  onChange={(e) => setDraftName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleRenameSave();
                    }
                    if (e.key === 'Escape') {
                      e.preventDefault();
                      handleRenameCancel();
                    }
                  }}
                  aria-label="Rename activity"
                />

                <div className="selected-thread-actions">
                  <button
                    type="button"
                    className="thread-action"
                    aria-label="Confirm rename"
                    title="Save"
                    onClick={handleRenameSave}
                  >
                    ✓
                  </button>
                  <button
                    type="button"
                    className="thread-action"
                    aria-label="Cancel rename"
                    title="Cancel"
                    onClick={handleRenameCancel}
                  >
                    ×
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="checkins-history" data-testid="checkins-history">
            <p className="checkins-label">Recent steps:</p>

            {checkinsForSelectedThread.length === 0 ? (
              <p className="empty-state">No steps yet. Start by adding one.</p>
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
  );
};
