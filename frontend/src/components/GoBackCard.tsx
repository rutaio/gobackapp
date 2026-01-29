import type { Thread, Checkin } from '../types/types';

interface GoBackCardProps {
  selectedThread: Thread | null;
  checkin: string;
  onCheckinChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  checkinsForSelectedThread: Checkin[];
}
export const GoBackCard = ({
  selectedThread,
  checkin,
  onCheckinChange,
  onSubmit,
  checkinsForSelectedThread,
}: GoBackCardProps) => {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Go Back
        </h2>
        <p className="text-lg text-slate-600">
          Continue from where you left off.
        </p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        {selectedThread ? (
          <div className="space-y-6">
            <p className="text-2xl font-semibold text-[#00796b]">
              {selectedThread.name}
            </p>

            <div className="checkins-history">
              {checkinsForSelectedThread.length === 0 ? (
                <p className="text-slate-500">No check-ins yet</p>
              ) : (
                <>
                  <p className="checkins-label font-semibold text-slate-800">
                    Last time you did:
                  </p>

                  <ul className="mt-2 list-none border-l-2 border-slate-200 pl-4 space-y-2">
                    {checkinsForSelectedThread.map((checkin) => (
                      <li
                        key={checkin.id}
                        className="text-slate-600 leading-snug cursor-default select-text"
                      >
                        {checkin.text}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <textarea
                id="checkin"
                rows={4}
                value={checkin}
                required
                placeholder="What small step will keep this alive now?"
                onChange={(event) => onCheckinChange(event.target.value)}
                className={[
                  'w-full resize-y rounded-lg border border-slate-300 bg-white p-4 text-slate-900',
                  'placeholder:text-slate-400',
                  'focus:outline-none focus:ring-2 focus:ring-[#00796b] focus:ring-offset-2 focus:ring-offset-white',
                ].join(' ')}
              />

              <button
                type="submit"
                className={[
                  'inline-flex items-center justify-center rounded-lg px-6 py-4',
                  'bg-[#00796b] text-white font-semibold',
                  'hover:bg-[#00695c] transition-colors',
                  'focus:outline-none focus:ring-4 focus:ring-[#00796b]/35',
                ].join(' ')}
              >
                Save and continue
              </button>
            </form>
          </div>
        ) : (
          <p className="text-slate-600">Select a thread to continue</p>
        )}
      </div>
    </div>
  );
};
