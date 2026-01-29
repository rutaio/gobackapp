import type { Thread } from '../types/types';

interface ThreadsItemProps {
  thread: Thread;
  isSelected: boolean;
  isEditing: boolean;
  onSelectThread: (threadId: string) => void;
  onStartEditing: (threadId: string) => void;
  onRenameConfirm: (threadId: string, newName: string) => void;
}

export const ThreadItem = ({
  thread,
  isSelected,
  isEditing,
  onSelectThread,
  onStartEditing,
  onRenameConfirm,
}: ThreadsItemProps) => {
  return (
    <li
      className={[
        'group flex items-center justify-between gap-3 rounded-lg px-4 py-4',
        'bg-slate-100 hover:bg-slate-200 transition-colors',
        isSelected ? 'bg-teal-50 hover:bg-teal-100' : '',
      ].join(' ')}
      onClick={() => onSelectThread(thread.id)}
      // ^ makes entire row clickable like Pico
    >
      {/* LEFT: name / input */}
      <div className="min-w-0 flex-1">
        {isEditing ? (
          <input
            defaultValue={thread.name}
            autoFocus
            onClick={(event) => event.stopPropagation()}
            onBlur={(event) => onRenameConfirm(thread.id, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                onRenameConfirm(thread.id, event.currentTarget.value);
              }
              if (event.key === 'Escape') {
                event.preventDefault();
                onRenameConfirm(thread.id, thread.name);
              }
            }}
            className={[
              'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900',
              'focus:outline-none focus:ring-2 focus:ring-[#00796b] focus:ring-offset-2 focus:ring-offset-white',
            ].join(' ')}
          />
        ) : (
          <span className="block truncate text-lg text-slate-900">
            {thread.name}
          </span>
        )}
      </div>

      {/* RIGHT: edit button */}
      <button
        aria-label="Rename thread"
        onClick={(event) => {
          event.stopPropagation();
          onStartEditing(thread.id);
        }}
        className={[
          // no button UI
          'rounded p-1',
          // hidden unless selected
          isSelected
            ? 'opacity-60 hover:opacity-100'
            : 'opacity-0 pointer-events-none',
          // optional: on row hover, you can slightly show it (remove if you want strict selected-only)
          // "group-hover:opacity-40",
          'transition-opacity',
        ].join(' ')}
      >
        ✏️
      </button>
    </li>
  );
};
