import type { Thread } from '../types/types';
import '../styles/components/thread-tab.css';

interface ThreadTabProps {
  thread: Thread;
  isSelected: boolean;
  onSelectThread: (threadId: string) => void;
}

export const ThreadTab = ({
  thread,
  isSelected,
  onSelectThread,
}: ThreadTabProps) => {
  return (
    <li
      className={`thread-tab ${isSelected ? 'is-selected' : ''}`}
      data-testid="thread-item"
    >
      <button type="button" onClick={() => onSelectThread(thread.id)}>
        <span data-testid="thread-name">{thread.name}</span>
      </button>
    </li>
  );
};
