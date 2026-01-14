import '../styles/pages/home.css';
import { threads } from '../data/threads';
import { useState } from 'react';
import { ThreadsList } from '../components/ThreadsList';
import { GoBackCard } from '../components/GoBackCard';

export const HomePage = () => {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [checkin, setCheckin] = useState('');

  const handleThreadClick = (threadId: string) => {
    console.log('Selected thread id:', threadId);
    setSelectedThreadId(threadId);
  };

  const selectedThreadData =
    threads.find((thread) => thread.id === selectedThreadId) ?? null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({
      threadId: selectedThreadId,
      text: checkin,
    });
    setCheckin('');
  };

  return (
    <div className="page">
      <div className="dashboard">
        <div className="panel">
          <ThreadsList
            threads={threads}
            selectedThreadId={selectedThreadId}
            onSelectThread={handleThreadClick}
          />
        </div>

        <div className="panel">
          <GoBackCard
            selectedThread={selectedThreadData}
            checkin={checkin}
            onCheckinChange={setCheckin}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};
