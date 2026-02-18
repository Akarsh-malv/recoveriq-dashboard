interface SelectOption<TValue extends string> {
  value: TValue;
  label: string;
}

interface SelectFieldProps<TValue extends string> {
  label: string;
  value: TValue;
  options: SelectOption<TValue>[];
  onChange: (value: TValue) => void;
  helperText?: string;
}

export function SelectField<TValue extends string>({
  label,
  value,
  options,
  onChange,
  helperText,
}: SelectFieldProps<TValue>) {
  return (
    <label className="block text-sm text-neutral-mid">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as TValue)}
        className="mt-1 h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-neutral-darkest focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText && <span className="mt-1 block text-xs text-neutral-mid">{helperText}</span>}
    </label>
  );
}
