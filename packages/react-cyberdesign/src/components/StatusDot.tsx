import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual state. @default 'live' */
  status?: 'live' | 'success' | 'warn' | 'danger' | 'paused' | 'idle';
  /** Optional label (e.g. SYS.ACTIVE / Live). */
  children?: ReactNode;
  /** Hide the text label, show only the orb. */
  orbOnly?: boolean;
}

/**
 * Live/system status indicator — ocint `SYS.ACTIVE` pulse and
 * robostrudel Live/Paused dots.
 */
export function StatusDot({
  status = 'live',
  children,
  orbOnly = false,
  className = '',
  ...rest
}: StatusDotProps) {
  const statusClass =
    status === 'idle'
      ? undefined
      : status === 'success'
        ? 'cd-status-dot--success'
        : `cd-status-dot--${status}`;

  return (
    <span className={cn('cd-status-dot', statusClass, className)} {...rest}>
      <span className="cd-status-dot__orb" aria-hidden />
      {!orbOnly && children != null && <span>{children}</span>}
    </span>
  );
}
