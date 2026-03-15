import '../styles/components/go-back-card.css';
import type { Thread, Checkin } from '../types/types';
import { CheckinForm } from './CheckinForm';
import { SelectedThreadHeader } from './SelectedThreadHeader';
import { CheckinsHistory } from './CheckinsHistory';

interface GoBackCardProps {
  selectedThread: Thread | null;
  isLoadingSelection?: boolean;

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
  isLoadingSelection = false,
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
  return (
    <div className="card" data-testid="go-back-card">
      {isLoadingSelection ? (
        <p>Loading activity...</p>
      ) : selectedThread ? (
        <>
          <SelectedThreadHeader
            selectedThread={selectedThread}
            editingThreadId={editingThreadId}
            onStartEditing={onStartEditing}
            onCancelEditing={onCancelEditing}
            onRenameConfirm={onRenameConfirm}
            threadIdPendingArchive={threadIdPendingArchive}
            onRequestArchiveThread={onRequestArchiveThread}
            onConfirmArchiveThread={onConfirmArchiveThread}
            onCancelArchiveThread={onCancelArchiveThread}
            checkinsCountForSelectedThread={checkinsCountForSelectedThread}
          />

          <CheckinsHistory checkins={checkinsForSelectedThread} />

          <CheckinForm
            checkinTitle={checkinTitle}
            checkinNote={checkinNote}
            onCheckinTitleChange={onCheckinTitleChange}
            onCheckinNoteChange={onCheckinNoteChange}
            onSubmit={onSubmit}
          />
        </>
      ) : (
        <p>Select an activity to continue</p>
      )}
    </div>
  );
};
