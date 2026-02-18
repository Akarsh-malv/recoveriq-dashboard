interface ToggleFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export function ToggleField({ label, checked, onChange, description }: ToggleFieldProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2">
      <div>
        <p className="text-sm font-medium text-neutral-darkest">{label}</p>
        {description && <p className="text-xs text-neutral-mid">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition ${
          checked ? 'bg-primary' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
            checked ? 'left-5' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}
