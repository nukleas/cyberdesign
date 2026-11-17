import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// 1 January 2023 was a Sunday.
const WEEKDAY_NAMES = WEEKDAYS.map((_, i) =>
  new Date(2023, 0, 1 + i).toLocaleDateString(undefined, { weekday: 'long' }),
);

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function addDays(d: Date, days: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days);
}

/** Same day of the month `months` away, clamped to that month's length. */
function addMonths(d: Date, months: number) {
  const target = new Date(d.getFullYear(), d.getMonth() + months, 1);
  return new Date(
    target.getFullYear(),
    target.getMonth(),
    Math.min(d.getDate(), daysInMonth(target)),
  );
}

function sameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function sameDay(a: Date, b: Date) {
  return sameMonth(a, b) && a.getDate() === b.getDate();
}

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

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
  /**
   * Dates that cannot be selected. They stay reachable with the arrow keys and
   * are announced as disabled.
   */
  isDateDisabled?: (date: Date) => boolean;
  onSelect?: (date: Date) => void;
  onMonthChange?: (month: Date) => void;
}

/**
 * Month grid calendar with neon selection.
 *
 * Keyboard (WAI-ARIA date picker grid): the grid is one Tab stop, on the
 * selected day, else today, else the 1st. Arrow keys move by day and by week
 * and turn the month when they cross its edge; Home / End go to the start / end
 * of the week; PageUp / PageDown change the month, with Shift the year; Enter
 * or Space selects the focused day.
 */
export function Calendar({
  selected,
  defaultSelected,
  month,
  defaultMonth,
  isDateDisabled,
  onSelect,
  onMonthChange,
  className = '',
  ...rest
}: CalendarProps) {
  const [internalMonth, setInternalMonth] = useState(() =>
    startOfMonth(defaultMonth ?? selected ?? defaultSelected ?? new Date()),
  );
  const [internalSelected, setInternalSelected] = useState<Date | undefined>(defaultSelected);
  // The day the keyboard last moved to: the grid's Tab stop while it is in view.
  const [focusDate, setFocusDate] = useState<Date>();
  const gridRef = useRef<HTMLDivElement>(null);
  const focusPending = useRef(false);
  const titleId = useId();

  const view = startOfMonth(month ?? internalMonth);
  const value = selected ?? internalSelected;
  const today = useMemo(() => new Date(), []);
  const tabStop = [focusDate, value, today].find((d) => d && sameMonth(d, view)) ?? view;

  const setView = (d: Date) => {
    const next = startOfMonth(d);
    if (month == null) setInternalMonth(next);
    onMonthChange?.(next);
  };

  const choose = (date: Date) => {
    if (isDateDisabled?.(date)) return;
    if (selected == null) setInternalSelected(date);
    setFocusDate(date);
    onSelect?.(date);
  };

  /** Show the month `months` away, keeping the Tab stop on the same day of the month. */
  const page = (months: number) => {
    const next = addMonths(tabStop, months);
    setFocusDate(next);
    setView(next);
  };

  // After a key moved the Tab stop (possibly into another month), focus it.
  useEffect(() => {
    if (!focusPending.current) return;
    focusPending.current = false;
    gridRef.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus();
  });

  const weeks = useMemo(() => {
    const start = addDays(view, -view.getDay());
    const count = Math.ceil((view.getDay() + daysInMonth(view)) / 7);
    return Array.from({ length: count }, (_, w) =>
      Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d)),
    );
  }, [view]);

  return (
    <div className={cn('cd-calendar', className)} {...rest}>
      <div className="cd-calendar__header">
        <span id={titleId} className="cd-calendar__title" aria-live="polite">
          {formatMonth(view)}
        </span>
        <div className="cd-calendar__nav">
          <button
            type="button"
            className="cd-calendar__nav-btn"
            aria-label="Previous month"
            onClick={() => page(-1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="cd-calendar__nav-btn"
            aria-label="Next month"
            onClick={() => page(1)}
          >
            ›
          </button>
        </div>
      </div>
      <div
        ref={gridRef}
        className="cd-calendar__grid"
        role="grid"
        aria-labelledby={titleId}
        onKeyDown={(e) => {
          const key = (e.target as HTMLElement).dataset.date;
          const from = weeks.flat().find((d) => dayKey(d) === key);
          if (!from) return;
          let next: Date;
          if (e.key === 'ArrowLeft') next = addDays(from, -1);
          else if (e.key === 'ArrowRight') next = addDays(from, 1);
          else if (e.key === 'ArrowUp') next = addDays(from, -7);
          else if (e.key === 'ArrowDown') next = addDays(from, 7);
          else if (e.key === 'Home') next = addDays(from, -from.getDay());
          else if (e.key === 'End') next = addDays(from, 6 - from.getDay());
          else if (e.key === 'PageUp') next = addMonths(from, e.shiftKey ? -12 : -1);
          else if (e.key === 'PageDown') next = addMonths(from, e.shiftKey ? 12 : 1);
          else {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              choose(from);
            }
            return;
          }
          e.preventDefault();
          focusPending.current = true;
          setFocusDate(next);
          if (!sameMonth(next, view)) setView(next);
        }}
      >
        <div className="cd-calendar__week" role="row">
          {WEEKDAYS.map((w, i) => (
            <div
              key={w}
              className="cd-calendar__weekday"
              role="columnheader"
              aria-label={WEEKDAY_NAMES[i]}
            >
              {w}
            </div>
          ))}
        </div>
        {weeks.map((week) => (
          <div key={dayKey(week[0])} className="cd-calendar__week" role="row">
            {week.map((date) => {
              const isSelected = value ? sameDay(date, value) : false;
              const isToday = sameDay(date, today);
              return (
                <div
                  key={dayKey(date)}
                  role="gridcell"
                  tabIndex={sameDay(date, tabStop) ? 0 : -1}
                  data-date={dayKey(date)}
                  aria-label={date.toLocaleDateString(undefined, { dateStyle: 'full' })}
                  aria-selected={isSelected}
                  aria-disabled={isDateDisabled?.(date) || undefined}
                  aria-current={isToday ? 'date' : undefined}
                  className={cn(
                    'cd-calendar__day',
                    !sameMonth(date, view) && 'is-outside',
                    isToday && 'is-today',
                    isSelected && 'is-selected',
                  )}
                  onClick={() => choose(date)}
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
