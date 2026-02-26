import type { Thread, Checkin } from '../types/types';

export function createSeedCheckins(threads: Thread[]): Checkin[] {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  const getThread = (name: string) => threads.find((t) => t.name === name);

  const writing = getThread('Writing');
  const business = getThread('Business');
  const research = getThread('Research');

  if (!writing || !business || !research) return [];

  return [
    {
      id: crypto.randomUUID(),
      threadId: writing.id,
      text: 'Got a notebook just for writing',
      createdAt: now - 3 * oneDay,
    },
    {
      id: crypto.randomUUID(),
      threadId: writing.id,
      text: 'Blocked 30 minutes for writing this week',
      createdAt: now - 2 * oneDay,
    },
    {
      id: crypto.randomUUID(),
      threadId: writing.id,
      text: 'Wrote the first imperfect paragraph',
      createdAt: now,
    },

    // Business
    {
      id: crypto.randomUUID(),
      threadId: business.id,
      text: 'Wrote down why this idea matters to me',
      createdAt: now - 3 * oneDay,
    },
    {
      id: crypto.randomUUID(),
      threadId: business.id,
      text: 'Listed 3 traits of my ideal customer',
      createdAt: now - 2 * oneDay,
    },
    {
      id: crypto.randomUUID(),
      threadId: business.id,
      text: 'Found an online community where they already gather',
      createdAt: now,
    },

    // Research
    {
      id: crypto.randomUUID(),
      threadId: research.id,
      text: 'Brainstormed questions I am genuinely curious about',
      createdAt: now - 3 * oneDay,
    },
    {
      id: crypto.randomUUID(),
      threadId: research.id,
      text: 'Grouped them into 5 themes',
      createdAt: now - 2 * oneDay,
    },
    {
      id: crypto.randomUUID(),
      threadId: research.id,
      text: 'Saved 2 resources for one theme',
      createdAt: now,
    },
  ];
}
