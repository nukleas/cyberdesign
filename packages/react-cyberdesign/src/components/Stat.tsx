import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  /** Uppercase caption above the value. */
  label: ReactNode;
  /** The headline metric. */
  value: ReactNode;
  /** Secondary change/context line below the value. */
  delta?: ReactNode;
  /** Tints the delta green (`up`) or red (`down`). */
  trend?: 'up' | 'down';
  /** Color treatment for the value. Default is the neon-green metric look. */
  variant?: 'default' | 'accent' | 'red' | 'yellow' | 'blue' | 'magenta';
}

/** Metric block — uppercase label, neon value and optional trend delta. */
export function Stat({
  label,
  value,
  delta,
  trend,
  variant = 'default',
  className = '',
  ...rest
}: StatProps) {
  return (
    <div
      className={cn('cd-stat', variant !== 'default' && `cd-stat--${variant}`, className)}
      {...rest}
    >
      <span className="cd-stat__label">{label}</span>
      <span className="cd-stat__value">{value}</span>
      {delta != null && (
        <span className={cn('cd-stat__delta', trend && `cd-stat__delta--${trend}`)}>{delta}</span>
      )}
    </div>
  );
}

/** Grid container that separates `Stat` cards with 1px border lines. */
export function StatGrid({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('cd-stats', className)} {...rest}>
      {children}
    </div>
  );
}

Stat.Grid = StatGrid;
