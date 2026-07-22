import { useEffect, useState } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface ClockProps extends HTMLAttributes<HTMLSpanElement> {
  /** IANA timezone. @default local */
  timeZone?: string;
  /** Show calendar date. @default true */
  showDate?: boolean;
  /** 24h clock. @default true */
  hour12?: boolean;
}

/**
 * Live clock readout — dashboard-app header date/time strip.
 */
export function Clock({
  timeZone,
  showDate = true,
  hour12 = false,
  className = '',
  ...rest
}: ClockProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString(undefined, {
    hour12,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone,
  });
  const date = now.toLocaleDateString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone,
  });

  return (
    <span className={cn('cd-clock', className)} {...rest}>
      {showDate && <span className="cd-clock__date">{date}</span>}
      <span className="cd-clock__time">{time}</span>
    </span>
  );
}
