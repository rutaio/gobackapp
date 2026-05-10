import '../styles/components/threads-tabs.css';
import { ThreadTab } from './ThreadTab';
import { useState } from 'react';
import type { Thread, Checkin } from '../types/types';
import { ThreadExpandedContent } from './ThreadExpandedContent';

interface ThreadsTabsProps {
  threads: Thread[];
  selectedThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onAddThread: (newThreadName: string) => void;

  selectedThread: Thread | null;
  checkinTitle: string;
  checkinNote: string;
  onCheckinTitleChange: (value: string) => void;
  onCheckinNoteChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  checkinsForSelectedThread: Checkin[];

  editingThreadId: string | null;
  onStartEditing: (threadId: string) => void;
  onCancelEditing: () => void;
  onRenameConfirm: (threadId: string, newName: string) => void;

  threadIdPendingArchive: string | null;
  onRequestArchiveThread: (threadId: string) => void;
  onConfirmArchiveThread: (threadId: string) => void;
  onCancelArchiveThread: () => void;

  checkinsCountForSelectedThread: number;
}

export const ThreadsTabs = ({
  threads,
  selectedThreadId,
  onSelectThread,
  onAddThread,

  selectedThread,
  checkinTitle,
  checkinNote,
  onCheckinTitleChange,
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
            {visibleThreads.map((thread) => {
              const isSelected = thread.id === selectedThreadId;

              return (
                <li
                  key={thread.id}
                  className={`thread-tab ${isSelected ? 'is-selected' : ''}`}
                  data-testid="thread-item"
                >
                  <ThreadTab
                    thread={thread}
                    isSelected={isSelected}
                    onSelectThread={onSelectThread}
                  />

                  {isSelected && selectedThread && (
                    <div className="thread-tab__expanded">
                      <ThreadExpandedContent
                        selectedThread={selectedThread}
                        checkinTitle={checkinTitle}
                        checkinNote={checkinNote}
                        onCheckinTitleChange={onCheckinTitleChange}
                        onCheckinNoteChange={onCheckinNoteChange}
                        onSubmit={onSubmit}
                        checkinsForSelectedThread={checkinsForSelectedThread}
                        editingThreadId={editingThreadId}
                        onStartEditing={onStartEditing}
                        onCancelEditing={onCancelEditing}
                        onRenameConfirm={onRenameConfirm}
                        threadIdPendingArchive={threadIdPendingArchive}
                        onRequestArchiveThread={onRequestArchiveThread}
                        onConfirmArchiveThread={onConfirmArchiveThread}
                        onCancelArchiveThread={onCancelArchiveThread}
                        checkinsCountForSelectedThread={
                          checkinsCountForSelectedThread
                        }
                      />
                    </div>
                  )}
                </li>
              );
            })}
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
