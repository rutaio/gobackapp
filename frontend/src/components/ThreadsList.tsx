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
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Threads
        </h2>
        <p className="text-lg text-slate-600">
          Your focus areas that need periodic return.
        </p>
      </header>

      <ul className="space-y-3">
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
  );
};
