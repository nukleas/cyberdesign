import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import type { CdColor } from '../lib/types';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** Color variant. Defaults to `orange`. */
  color?: CdColor;
  children?: ReactNode;
}

/** Inline status badge — uppercase, pixel-corner, with a neon color variant. */
export function Badge({
  color = 'orange',
  className = '',
  children,
  ...rest
}: BadgeProps) {
  return (
    <span className={cn('cd-badge', `cd-badge--${color}`, className)} {...rest}>
      {children}
    </span>
  );
}
