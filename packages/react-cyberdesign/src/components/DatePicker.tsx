import { useEffect, useId, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { useOverlayFocus } from '../lib/focus';
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
  /** Dates that cannot be picked. */
  isDateDisabled?: (date: Date) => boolean;
  /** Id of the field, so a `<label htmlFor>` can name it. */
  id?: string;
  /** Accessible name of the field. */
  'aria-label'?: string;
  /** Id of the element that names the field. */
  'aria-labelledby'?: string;
}

/**
 * Read-only field + calendar popup for picking a date.
 *
 * Keyboard: on the field, Enter, Space or ArrowDown opens the calendar and
 * moves focus to the selected day (else today). In the calendar the `Calendar`
 * grid keys apply; Enter or Space picks the day and closes; Escape closes
 * without picking; Tab cycles between the month buttons and the grid. Closing
 * always returns focus to the field.
 */
export function DatePicker({
  value,
  defaultValue,
  onChange,
  placeholder = 'Pick a date',
  disabled = false,
  isDateDisabled,
  id,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  className = '',
  ...rest
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState<Date | undefined>(defaultValue);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const selected = value ?? internal;

  useOverlayFocus(panelRef, open, () => setOpen(false));

  // useOverlayFocus lands on the first tabbable element (the previous-month
  // button); a date picker starts on the grid's day instead.
  useEffect(() => {
    if (open) {
      panelRef.current?.querySelector<HTMLElement>('[role="gridcell"][tabindex="0"]')?.focus();
    }
  }, [open]);

  // A press outside the field and its calendar closes it.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className={cn('cd-date-picker', open && 'is-open', className)} {...rest}>
      <input
        id={id}
        type="text"
        className="cd-input"
        readOnly
        role="combobox"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        disabled={disabled}
        value={selected ? formatDate(selected) : ''}
        placeholder={placeholder}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
          }
        }}
      />
      {open && (
        <div
          ref={panelRef}
          id={panelId}
          className="cd-date-picker__panel"
          role="dialog"
          aria-modal="true"
          aria-label="Choose date"
        >
          <Calendar
            selected={selected}
            isDateDisabled={isDateDisabled}
            onSelect={(d) => {
              if (value == null) setInternal(d);
              onChange?.(d);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
