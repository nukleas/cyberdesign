import { useMemo, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { Input } from './Input';

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
}

/** Searchable select — filters options as you type. */
export function Combobox({
  options,
  value,
  defaultValue = '',
  onChange,
  placeholder = 'Select…',
  emptyText = 'No matches',
  disabled = false,
  className = '',
  ...rest
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue);
  const [query, setQuery] = useState('');
  const selected = value ?? internal;

  const selectedLabel = options.find((o) => o.value === selected)?.label ?? '';

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
    );
  }, [options, query]);

  return (
    <div className={cn('cd-combobox', open && 'is-open', className)} {...rest}>
      <Input
        disabled={disabled}
        placeholder={placeholder}
        value={open ? query : selectedLabel}
        onFocus={() => {
          setOpen(true);
          setQuery('');
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onBlur={() => {
          // delay so option click registers
          window.setTimeout(() => setOpen(false), 120);
        }}
      />
      <div className="cd-combobox__menu" role="listbox">
        {filtered.length === 0 && (
          <div className="cd-command__empty" style={{ padding: 12 }}>
            {emptyText}
          </div>
        )}
        {filtered.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="option"
            disabled={opt.disabled}
            aria-selected={opt.value === selected}
            className="cd-combobox__option"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (value == null) setInternal(opt.value);
              onChange?.(opt.value);
              setOpen(false);
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
