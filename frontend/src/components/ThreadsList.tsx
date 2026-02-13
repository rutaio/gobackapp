import '../styles/components/threads-list.css';
import type { Thread } from '../types/types';
import { ThreadItem } from './ThreadItem';

interface ThreadsListProps {
  threads: Thread[];
  selectedThreadId: string | null;
  editingThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onStartEditing: (threadId: string) => void;
  onRenameConfirm: (threadId: string, newName: string) => void;
}

export const ThreadsList = ({
  threads,
  selectedThreadId,
  editingThreadId,
  onSelectThread,
  onStartEditing,
  onRenameConfirm,
}: ThreadsListProps) => {
  return (
    <>
      <h2>Threads</h2>
      <p>Group your work areas. Rename anytime.</p>
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
