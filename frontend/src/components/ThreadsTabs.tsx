import '../styles/components/threads-tabs.css';
import type { Thread } from '../types/types';
import { ThreadTab } from './ThreadTab';
import { useState } from 'react';

interface ThreadsTabsProps {
  threads: Thread[];
  selectedThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onAddThread: (newThreadName: string) => void;
}

export const ThreadsTabs = ({
  threads,
  selectedThreadId,
  onSelectThread,
  onAddThread,
}: ThreadsTabsProps) => {
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
    <section className="threads-tabs" aria-label="Activities">
      <div className="threads-tabs__row">
        <span className="threads-tabs__label">Activities:</span>

        <div
          className="threads-tabs__list"
          role="tablist"
          aria-label="Activities list"
        >
          <ul className="threads-tabs__ul">
            {visibleThreads.map((thread) => (
              <ThreadTab
                key={thread.id}
                thread={thread}
                isSelected={thread.id === selectedThreadId}
                onSelectThread={onSelectThread}
              />
            ))}
          </ul>
        </div>

        <div className="threads-tabs__add">
          {!isAdding ? (
            <button
              type="button"
              className="threads-tabs__addBtn"
              data-testid="add-thread-button"
              onClick={() => setIsAdding(true)}
            >
              + Add
            </button>
          ) : (
            <div
              className="threads-tabs__addForm"
              data-testid="threads-add-form"
            >
              <input
                data-testid="new-thread-input"
                maxLength={40}
                value={newThreadName}
                placeholder="New activity..."
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
                className="threads-tabs__icon"
                onClick={handleAddThread}
                aria-label="Add"
                title="Add"
              >
                ✓
              </button>
              <button
                data-testid="cancel-add-thread"
                type="button"
                className="threads-tabs__icon"
                onClick={handleAddCancel}
                aria-label="Cancel"
                title="Cancel"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
