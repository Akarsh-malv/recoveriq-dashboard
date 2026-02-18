interface SettingsActionsBarProps {
  dirty: boolean;
  saved: boolean;
  onCancel: () => void;
  onSave: () => void;
}

export function SettingsActionsBar({ dirty, saved, onCancel, onSave }: SettingsActionsBarProps) {
  return (
    <div className="sticky bottom-0 z-10 mt-4 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-sm text-neutral-mid">{saved ? 'Saved' : dirty ? 'Unsaved changes' : 'No pending changes'}</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={!dirty}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-neutral-mid hover:bg-neutral-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty}
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
