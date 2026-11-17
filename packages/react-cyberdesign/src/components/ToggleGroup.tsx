import { useState } from 'react';
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { moveFocus } from '../lib/focus';

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

/**
 * Group of toggle buttons — single or multi select.
 *
 * Keyboard (WAI-ARIA Toolbar): the group is one Tab stop — the button focused
 * last, else the first pressed one, else the first. Left / Right move focus
 * between buttons, wrapping, and Home / End go to the first / last; disabled
 * buttons are skipped. Arrow keys only move focus: Enter / Space toggle the
 * focused button, whose state is exposed with `aria-pressed`.
 */
export function ToggleGroup({
  items,
  value,
  defaultValue,
  multiple = false,
  onValueChange,
  size = 'md',
  className = '',
  onKeyDown,
  ...rest
}: ToggleGroupProps) {
  const [internal, setInternal] = useState<string | string[]>(
    defaultValue ?? (multiple ? [] : ''),
  );
  const current = value ?? internal;
  const [focused, setFocused] = useState<string>();

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

  const enabled = items.filter((item) => !item.disabled);
  const tabStop = (
    enabled.find((item) => item.value === focused) ??
    enabled.find((item) => isOn(item.value)) ??
    enabled[0]
  )?.value;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    moveFocus(
      event,
      Array.from(event.currentTarget.querySelectorAll<HTMLElement>('.cd-toggle:not(:disabled)')),
      { orientation: 'horizontal' },
    );
  };

  return (
    <div
      className={cn('cd-toggle-group', className)}
      role="toolbar"
      {...rest}
      onKeyDown={handleKeyDown}
    >
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          disabled={item.disabled}
          className={cn('cd-toggle', size === 'sm' && 'cd-toggle--sm', isOn(item.value) && 'is-on')}
          data-state={isOn(item.value) ? 'on' : 'off'}
          aria-pressed={isOn(item.value)}
          tabIndex={item.value === tabStop ? 0 : -1}
          onFocus={() => setFocused(item.value)}
          onClick={() => select(item.value)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
