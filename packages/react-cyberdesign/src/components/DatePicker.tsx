import { useState } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { Input } from './Input';
import { Calendar } from './Calendar';

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export interface DatePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

/** Input + calendar popover for picking a date. */
export function DatePicker({
  value,
  defaultValue,
  onChange,
  placeholder = 'Pick a date',
  disabled = false,
  className = '',
  ...rest
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState<Date | undefined>(defaultValue);
  const selected = value ?? internal;

  return (
    <div className={cn('cd-date-picker', open && 'is-open', className)} {...rest}>
      <Input
        readOnly
        disabled={disabled}
        value={selected ? formatDate(selected) : ''}
        placeholder={placeholder}
        onClick={() => !disabled && setOpen((o) => !o)}
        aria-expanded={open}
      />
      <div className="cd-date-picker__panel">
        <Calendar
          selected={selected}
          onSelect={(d) => {
            if (value == null) setInternal(d);
            onChange?.(d);
            setOpen(false);
          }}
        />
      </div>
    </div>
  );
}
