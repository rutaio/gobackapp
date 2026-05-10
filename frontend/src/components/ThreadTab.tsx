import type { Thread } from '../types/types';
import '../styles/components/thread-tab.css';

interface ThreadTabProps {
  thread: Thread;
  isSelected: boolean;
  onSelectThread: (threadId: string) => void;
}

export const ThreadTab = ({ thread, onSelectThread }: ThreadTabProps) => {
  return (
    <button type="button" onClick={() => onSelectThread(thread.id)}>
      <span data-testid="thread-name">{thread.name}</span>
      {thread.isSeed && <span className="thread-badge">Sample</span>}
    </button>
  );
};
