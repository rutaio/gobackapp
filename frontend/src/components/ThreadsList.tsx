// If a function only affects rendering of one component → it can live in that component

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
  onRequestArchiveThread: (threadId: string) => void; // click bin
  onConfirmArchiveThread: (threadId: string) => void; // click ✓
  onCancelArchiveThread: () => void; // click ×
  threadIdPendingArchive: string | null;
  getCheckinsCount: (threadId: string) => number;
}

export const ThreadsList = ({
  threads,
  selectedThreadId,
  editingThreadId,
  onSelectThread,
  onStartEditing,
  onRenameConfirm,
  onAddThread,
  onRequestArchiveThread,
  onConfirmArchiveThread,
  onCancelArchiveThread,
  threadIdPendingArchive,
  getCheckinsCount,
}: ThreadsListProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newThreadName, setNewThreadName] = useState('');
  const visibleThreads = threads.filter((t) => !t.isArchived);

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
      <div className="threads-header">
        <h2>Activities</h2>
        <button
          data-testid="add-thread-button"
          type="button"
          className="threads-add-icon"
          aria-label="Add thread"
          title="Add thread"
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
        >
          +
        </button>
      </div>

      <p className="threads-subtitle">Name areas you want to continue.</p>

      <div className="threads-list">
        <ul>
          {isAdding && (
            <li className="thread-item--adding" data-testid="threads-add-form">
              <input
                data-testid="new-thread-input"
                maxLength={40}
                value={newThreadName}
                placeholder="New thread name..."
                autoFocus
                onChange={(e) => setNewThreadName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddThread();
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    handleAddCancel();
                  }
                }}
              />
              <button
                data-testid="confirm-add-thread"
                type="button"
                className="thread-edit thread-edit--confirm"
                onClick={handleAddThread}
                aria-label="Add"
                title="Add"
              >
                ✓
              </button>
              <button
                data-testid="cancel-add-thread"
                type="button"
                className="thread-edit thread-edit--cancel"
                onClick={handleAddCancel}
                aria-label="Cancel"
                title="Cancel"
              >
                ×
              </button>
            </li>
          )}

          {visibleThreads.map((thread) => {
            const checkinsCount = getCheckinsCount(thread.id);
            const isPendingArchive = threadIdPendingArchive === thread.id;

            return (
              <ThreadItem
                key={thread.id}
                thread={thread}
                isSelected={thread.id === selectedThreadId}
                isEditing={thread.id === editingThreadId}
                onSelectThread={onSelectThread}
                onStartEditing={onStartEditing}
                onRenameConfirm={onRenameConfirm}
                checkinsCount={checkinsCount}
                isPendingArchive={isPendingArchive}
                onRequestArchiveThread={onRequestArchiveThread}
                onConfirmArchiveThread={onConfirmArchiveThread}
                onCancelArchiveThread={onCancelArchiveThread}
              />
            );
          })}
        </ul>
      </div>
    </>
  );
};
