import '../styles/components/go-back-card.css';

type CheckinFormProps = {
  checkinTitle: string;
  checkinNote: string;
  onCheckinTitleChange: (value: string) => void;
  onCheckinNoteChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
};

export const CheckinForm = ({
  checkinTitle,
  checkinNote,
  onCheckinTitleChange,
  onCheckinNoteChange,
  onSubmit,
}: CheckinFormProps) => {
  return (
    <div className="checkin-card">
      <form onSubmit={onSubmit} className="form">
        <div className="checkin-fields">
          <label htmlFor="checkin-title" className="checkin-label">
            Log small action you just completed:
          </label>

          <input
            data-testid="checkin-title-input"
            className="checkin-title-input"
            id="checkin-title"
            value={checkinTitle}
            placeholder="What action did you take?"
            required
            onChange={(e) => onCheckinTitleChange(e.target.value)}
          />

          <textarea
            data-testid="checkin-note-input"
            className="checkin-note-input"
            id="checkin-note"
            rows={3}
            value={checkinNote}
            placeholder="Notes (optional)"
            onChange={(e) => onCheckinNoteChange(e.target.value)}
          />
        </div>

        <button data-testid="save-checkin-button">Save</button>
      </form>
    </div>
  );
};
