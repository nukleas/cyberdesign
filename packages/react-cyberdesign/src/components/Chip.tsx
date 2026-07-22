import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Selected / pressed visual state. */
  active?: boolean;
  size?: 'sm' | 'md';
  children?: ReactNode;
}

/**
 * Compact filter/toggle chip — dashboard-app `NEAR` / `TOP` / category filters
 * and AI-shell quick-prompt style.
 */
export function Chip({
  active = false,
  size = 'md',
  className = '',
  children,
  type = 'button',
  ...rest
}: ChipProps) {
  return (
    <button
      type={type}
      className={cn('cd-chip', size === 'sm' && 'cd-chip--sm', active && 'is-active', className)}
      data-active={active || undefined}
      aria-pressed={active}
      {...rest}
    >
      {children}
    </button>
  );
}

export interface ChipRowProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function ChipRow({ className = '', children, ...rest }: ChipRowProps) {
  return (
    <div className={cn('cd-chip-row', className)} {...rest}>
      {children}
    </div>
  );
}
