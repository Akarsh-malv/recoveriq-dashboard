interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  helperText?: string;
}

export function NumberField({ label, value, onChange, min, max, helperText }: NumberFieldProps) {
  return (
    <label className="block text-sm text-neutral-mid">
      <span>{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={Math.round(value)}
        onChange={(event) => onChange(Math.round(Number(event.target.value || 0)))}
        className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-neutral-darkest focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {helperText && <span className="mt-1 block text-xs text-neutral-mid">{helperText}</span>}
    </label>
  );
}
