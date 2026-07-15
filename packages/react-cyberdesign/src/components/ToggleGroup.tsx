import { useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface ToggleGroupItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: ToggleGroupItem[];
  /** Controlled value (single) or values (multiple). */
  value?: string | string[];
  defaultValue?: string | string[];
  /** Allow multiple selection. */
  multiple?: boolean;
  onValueChange?: (value: string | string[]) => void;
  size?: 'sm' | 'md';
}

/** Group of toggle buttons — single or multi select. */
export function ToggleGroup({
  items,
  value,
  defaultValue,
  multiple = false,
  onValueChange,
  size = 'md',
  className = '',
  ...rest
}: ToggleGroupProps) {
  const [internal, setInternal] = useState<string | string[]>(
    defaultValue ?? (multiple ? [] : ''),
  );
  const current = value ?? internal;

  const isOn = (v: string) =>
    multiple ? (current as string[]).includes(v) : current === v;

  const select = (v: string) => {
    let next: string | string[];
    if (multiple) {
      const arr = [...(current as string[])];
      const i = arr.indexOf(v);
      if (i >= 0) arr.splice(i, 1);
      else arr.push(v);
      next = arr;
    } else {
      next = current === v ? '' : v;
    }
    if (value == null) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <div className={cn('cd-toggle-group', className)} role="group" {...rest}>
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          disabled={item.disabled}
          className={cn('cd-toggle', size === 'sm' && 'cd-toggle--sm', isOn(item.value) && 'is-on')}
          data-state={isOn(item.value) ? 'on' : 'off'}
          aria-pressed={isOn(item.value)}
          onClick={() => select(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
