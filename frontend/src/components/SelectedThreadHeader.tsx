import { useState } from 'react';
import type { Thread } from '../types/types';
import { EditIcon } from './icons/EditIcon';

type SelectedThreadHeaderProps = {
  selectedThread: Thread;

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
};

export const SelectedThreadHeader = ({
  selectedThread,

  editingThreadId,
  onStartEditing,
  onCancelEditing,
  onRenameConfirm,

  threadIdPendingArchive,
  onRequestArchiveThread,
  onConfirmArchiveThread,
  onCancelArchiveThread,

  checkinsCountForSelectedThread,
}: SelectedThreadHeaderProps) => {
  const [draftName, setDraftName] = useState('');

  const isEditingSelected = editingThreadId === selectedThread.id;
  const isPendingArchiveSelected = threadIdPendingArchive === selectedThread.id;

  const handleRenameSave = () => {
    onRenameConfirm(selectedThread.id, draftName);
  };

  const handleRenameCancel = () => {
    setDraftName(selectedThread.name);
    onCancelEditing();
  };

  return (
    <div className="selected-thread-row">
      {!isEditingSelected ? (
        <>
          <h4 className="selected-thread" data-testid="selected-thread-name">
            {selectedThread.name}
          </h4>

          <div className="selected-thread-actions">
            <button
              type="button"
              className="thread-action"
              aria-label="Rename activity"
              title="Rename"
              onClick={() => {
                setDraftName(selectedThread.name);
                onStartEditing(selectedThread.id);
              }}
            >
              <EditIcon size={18} />
            </button>

            {!isPendingArchiveSelected ? (
              <button
                type="button"
                className="thread-action"
                data-testid="thread-archive-button"
                aria-label="Archive activity"
                title={
                  checkinsCountForSelectedThread > 0
                    ? 'Archive (requires confirmation)'
                    : 'Archive'
                }
                onClick={() => onRequestArchiveThread(selectedThread.id)}
              >
                ×
              </button>
            ) : (
              <span
                className="thread-archive-confirm"
                data-testid="thread-archive-confirm"
              >
                <span className="thread-archive-text">Archive?</span>

                <button
                  type="button"
                  className="thread-action"
                  data-testid="confirm-archive-thread"
                  aria-label="Confirm archive"
                  title="Confirm"
                  onClick={() => onConfirmArchiveThread(selectedThread.id)}
                >
                  ✓
                </button>

                <button
                  type="button"
                  className="thread-action"
                  data-testid="cancel-archive-thread"
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
  );
};
