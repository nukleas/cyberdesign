import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /** Diameter preset. `md` is the default (no modifier). */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** `ring` (default), `dual` counter-rotating rings, or `dots` pulse. */
  variant?: 'ring' | 'dual' | 'dots';
  /** Accessible label announced to screen readers. */
  label?: string;
}

/** Loading spinner — ring / dual-ring / dot-pulse variants in five sizes. */
export function Spinner({
  size = 'md',
  variant = 'ring',
  label = 'Loading',
  className = '',
  ...rest
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        'cd-spinner',
        size !== 'md' && `cd-spinner--${size}`,
        variant === 'dual' && 'cd-spinner--dual',
        variant === 'dots' && 'cd-spinner--dots',
        className,
      )}
      {...rest}
    >
      {variant === 'dots' && <span />}
    </div>
  );
}
