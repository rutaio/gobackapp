import '../styles/components/threads-list.css';
import type { Thread } from '../types/types';
import { ThreadItem } from './ThreadItem';
import { useState } from 'react';

interface ThreadsListProps {
  threads: Thread[];
  selectedThreadId: string | null;
  editingThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onStartEditing: (threadId: string) => void;
  onRenameConfirm: (threadId: string, newName: string) => void;
  onAddThread: (newThreadName: string) => void;
}

export const ThreadsList = ({
  threads,
  selectedThreadId,
  editingThreadId,
  onSelectThread,
  onStartEditing,
  onRenameConfirm,
  onAddThread,
}: ThreadsListProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newThreadName, setNewThreadName] = useState('');

  const handleAddThread = () => {
    const trimmedName = newThreadName.trim();
    if (!trimmedName) return;

    onAddThread(trimmedName);

    setNewThreadName('');
    setIsAdding(false);
  };

  const handleAddCancel = () => {
    setNewThreadName('');
    setIsAdding(false);
  };

  return (
    <>
      <h2>Threads</h2>
      <p>Group your work into areas. Rename anytime.</p>

      {/* Add thread UI */}
      {isAdding ? (
        <div className="threads-add">
          <input
            data-testid="new-thread-input"
            maxLength={40}
            value={newThreadName}
            placeholder="New thread name..."
            autoFocus
            onChange={(event) => setNewThreadName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleAddThread();
              }
              if (event.key === 'Escape') {
                event.preventDefault();
                handleAddCancel();
              }
            }}
          />

          <div className="threads-add-actions">
            <button
              data-testid="confirm-add-thread"
              type="button"
              onClick={handleAddThread}
            >
              Add
            </button>
            <button
              data-testid="cancel-add-thread"
              type="button"
              onClick={handleAddCancel}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          data-testid="add-thread-button"
          type="button"
          className="secondary"
          onClick={() => setIsAdding(true)}
        >
          + Add Thread
        </button>
      )}

      <div className="threads-list">
        <ul>
          {threads.map((thread) => (
            <ThreadItem
              key={thread.id}
              thread={thread}
              isSelected={thread.id === selectedThreadId}
              isEditing={thread.id === editingThreadId}
              onSelectThread={onSelectThread}
              onStartEditing={onStartEditing}
              onRenameConfirm={onRenameConfirm}
            />
          ))}
        </ul>
      </div>
    </>
  );
};
