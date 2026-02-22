import '../styles/components/thread-item.css';
import type { Thread } from '../types/types';

interface ThreadsItemProps {
  thread: Thread;
  isSelected: boolean;
  isEditing: boolean;
  onSelectThread: (threadId: string) => void;
  onStartEditing: (threadId: string) => void;
  onRenameConfirm: (threadId: string, newName: string) => void;
  checkinsCount: number;
  // controlled by HomePage:
  isPendingArchive: boolean;
  onRequestArchiveThread: (threadId: string) => void;
  onConfirmArchiveThread: (threadId: string) => void;
  onCancelArchiveThread: () => void;
}

export const ThreadItem = ({
  thread,
  isSelected,
  isEditing,
  onSelectThread,
  onStartEditing,
  onRenameConfirm,
  checkinsCount,
  isPendingArchive,
  onRequestArchiveThread,
  onConfirmArchiveThread,
  onCancelArchiveThread,
}: ThreadsItemProps) => {
  return (
    <li
      data-testid="thread-item"
      className={`thread-item ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelectThread(thread.id)}
    >
      {isEditing ? (
        <input
          defaultValue={thread.name}
          autoFocus
          onClick={(event) => event.stopPropagation()}
          onBlur={(event) => onRenameConfirm(thread.id, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onRenameConfirm(thread.id, event.currentTarget.value);
            }
            if (event.key === 'Escape') {
              event.preventDefault();
              // simplest MVP cancel: just exit edit mode by "reverting" to old name
              onRenameConfirm(thread.id, thread.name);
            }
          }}
        />
      ) : (
        <span data-testid="thread-name" className="thread-name">
          {thread.name}
        </span>
      )}

      {/* Inline archive confirmation row, controlled by HomePage */}
      {!isEditing && isSelected && isPendingArchive ? (
        <div
          className="thread-archive-confirm"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="thread-archive-text">
            Archive? ({checkinsCount})
          </span>

          <button
            type="button"
            className="thread-edit thread-edit--confirm"
            aria-label="Confirm archive"
            title="Confirm"
            onClick={() => onConfirmArchiveThread(thread.id)}
          >
            ✓
          </button>

          <button
            type="button"
            className="thread-edit thread-edit--cancel"
            aria-label="Cancel archive"
            title="Cancel"
            onClick={onCancelArchiveThread}
          >
            ×
          </button>
        </div>
      ) : (
        <>
          <button
            data-testid="thread-edit-button"
            className="thread-edit thread-edit--pencil"
            aria-label="Rename thread"
            onClick={(event) => {
              event.stopPropagation();
              onStartEditing(thread.id);
            }}
          >
            ✏️
          </button>

          <button
            data-testid="thread-archive-button"
            className="thread-edit thread-edit--archive"
            aria-label="Archive thread"
            title="Archive"
            onClick={(event) => {
              event.stopPropagation();
              onRequestArchiveThread(thread.id);
            }}
          >
            🗑️
          </button>
        </>
      )}
    </li>
  );
};
