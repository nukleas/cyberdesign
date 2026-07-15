import { useMemo, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function formatMonth(d: Date) {
  return d.toLocaleString(undefined, { month: 'long', year: 'numeric' });
}

export interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Controlled selected date. */
  selected?: Date;
  /** Uncontrolled initial selection. */
  defaultSelected?: Date;
  /** Month currently displayed (controlled). */
  month?: Date;
  defaultMonth?: Date;
  onSelect?: (date: Date) => void;
  onMonthChange?: (month: Date) => void;
}

/** Month grid calendar with neon selection. */
export function Calendar({
  selected,
  defaultSelected,
  month,
  defaultMonth,
  onSelect,
  onMonthChange,
  className = '',
  ...rest
}: CalendarProps) {
  const [internalMonth, setInternalMonth] = useState(() =>
    startOfMonth(defaultMonth ?? defaultSelected ?? new Date()),
  );
  const [internalSelected, setInternalSelected] = useState<Date | undefined>(defaultSelected);

  const view = startOfMonth(month ?? internalMonth);
  const value = selected ?? internalSelected;
  const today = useMemo(() => new Date(), []);

  const setView = (d: Date) => {
    const next = startOfMonth(d);
    if (month == null) setInternalMonth(next);
    onMonthChange?.(next);
  };

  const cells = useMemo(() => {
    const firstDow = view.getDay();
    const total = daysInMonth(view);
    const prevTotal = daysInMonth(new Date(view.getFullYear(), view.getMonth() - 1, 1));
    const out: Array<{ date: Date; outside: boolean }> = [];
    for (let i = firstDow - 1; i >= 0; i--) {
      out.push({
        date: new Date(view.getFullYear(), view.getMonth() - 1, prevTotal - i),
        outside: true,
      });
    }
    for (let d = 1; d <= total; d++) {
      out.push({ date: new Date(view.getFullYear(), view.getMonth(), d), outside: false });
    }
    while (out.length % 7 !== 0) {
      const last = out[out.length - 1].date;
      out.push({
        date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1),
        outside: true,
      });
    }
    return out;
  }, [view]);

  return (
    <div className={cn('cd-calendar', className)} {...rest}>
      <div className="cd-calendar__header">
        <span className="cd-calendar__title">{formatMonth(view)}</span>
        <div className="cd-calendar__nav">
          <button
            type="button"
            className="cd-calendar__nav-btn"
            aria-label="Previous month"
            onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
          >
            ‹
          </button>
          <button
            type="button"
            className="cd-calendar__nav-btn"
            aria-label="Next month"
            onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
          >
            ›
          </button>
        </div>
      </div>
      <div className="cd-calendar__grid">
        {WEEKDAYS.map((w) => (
          <div key={w} className="cd-calendar__weekday">
            {w}
          </div>
        ))}
        {cells.map(({ date, outside }) => {
          const isSelected = value ? sameDay(date, value) : false;
          const isToday = sameDay(date, today);
          return (
            <button
              key={date.toISOString()}
              type="button"
              className={cn(
                'cd-calendar__day',
                outside && 'is-outside',
                isToday && 'is-today',
                isSelected && 'is-selected',
              )}
              onClick={() => {
                if (selected == null) setInternalSelected(date);
                onSelect?.(date);
              }}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
