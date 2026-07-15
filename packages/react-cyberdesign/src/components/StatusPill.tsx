import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export type StatusPillVariant =
  | 'default'
  | 'active'
  | 'developing'
  | 'resolved'
  | 'success'
  | 'critical'
  | 'muted';

export interface StatusPillProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: StatusPillVariant;
  children?: ReactNode;
}

/**
 * Situation / severity pill — ocint `DEVELOPING` / `ACTIVE` / `SEV 4 · CRITICAL`.
 */
export function StatusPill({
  variant = 'default',
  className = '',
  children,
  ...rest
}: StatusPillProps) {
  return (
    <span
      className={cn(
        'cd-status-pill',
        variant !== 'default' && `cd-status-pill--${variant}`,
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
