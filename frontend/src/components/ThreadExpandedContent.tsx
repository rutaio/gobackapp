import type { Thread, Checkin } from '../types/types';
import { CheckinForm } from './CheckinForm';
import { SelectedThreadHeader } from './SelectedThreadHeader';
import { CheckinsHistory } from './CheckinsHistory';

interface ThreadExpandedContentProps {
  selectedThread: Thread;

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

export const ThreadExpandedContent = ({
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
}: ThreadExpandedContentProps) => {
  return (
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
  );
};
