import type { ReactNode } from 'react';
import { fieldClass } from '@/components/ui/styles';

export type SelectOption = { value: string; label: string };

export function SelectField({
  label,
  value,
  options,
  onChange,
  footer,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  footer?: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {footer}
    </label>
  );
}
