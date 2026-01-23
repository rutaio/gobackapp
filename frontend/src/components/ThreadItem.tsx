import type { Thread } from '../types/types';

interface ThreadsItemProps {
  thread: Thread;
  isSelected: boolean;
  isEditing: boolean;
  onSelectThread: (threadId: string) => void;
  onStartEditing: (threadId: string) => void;
  onRenameConfirm: (threadId: string, newName: string) => void;
}

export const ThreadItem = ({
  thread,
  isSelected,
  isEditing,
  onSelectThread,
  onStartEditing,
  onRenameConfirm,
}: ThreadsItemProps) => {
  return (
    <li className={isSelected ? 'selected' : ''}>
      {isEditing ? (
        <input
          defaultValue={thread.name}
          autoFocus
          onBlur={(event) => onRenameConfirm(thread.id, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onRenameConfirm(thread.id, event.currentTarget.value);
            }
          }}
        />
      ) : (
        <span className="thread-name" onClick={() => onSelectThread(thread.id)}>
          {thread.name}
        </span>
      )}

      <button
        className="thread-edit"
        aria-label="Rename thread"
        onClick={(event) => {
          event.stopPropagation();
          onStartEditing(thread.id);
        }}
      >
        ✏️
      </button>
    </li>
  );
};
