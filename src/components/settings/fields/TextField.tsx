interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  readOnly?: boolean;
  type?: 'text' | 'email' | 'tel' | 'password' | 'time' | 'datetime-local' | 'url';
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  error,
  readOnly = false,
  type = 'text',
}: TextFieldProps) {
  return (
    <label className="block text-sm text-neutral-mid">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={`mt-1 h-10 w-full rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 ${
          error ? 'border-danger/40 focus:ring-danger/40' : 'border-gray-300 focus:ring-primary'
        } ${readOnly ? 'bg-neutral-light text-neutral-mid' : 'bg-white text-neutral-darkest'}`}
      />
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}
