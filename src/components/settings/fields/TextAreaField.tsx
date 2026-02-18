interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function TextAreaField({ label, value, onChange, placeholder, rows = 4 }: TextAreaFieldProps) {
  return (
    <label className="block text-sm text-neutral-mid">
      <span>{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-neutral-darkest focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </label>
  );
}
