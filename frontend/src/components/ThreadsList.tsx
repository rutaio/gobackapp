import type { Thread } from '../types/types';
import '../styles/components/threads-list.css';

interface ThreadsListProps {
  threads: Thread[];
  selectedThreadId: string | null;
  onSelectThread: (threadId: string) => void;
}

export const ThreadsList = ({
  threads,
  selectedThreadId,
  onSelectThread,
}: ThreadsListProps) => {
  return (
    <>
      <h2>Threads</h2>
      <p>Your project work areas that needs periodic return.</p>
      <div className="threads-list">
        <ul>
          {threads.map((thread) => (
            <li
              key={thread.id}
              onClick={() => onSelectThread(thread.id)}
              className={thread.id === selectedThreadId ? 'selected' : ''}
            >
              {thread.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
