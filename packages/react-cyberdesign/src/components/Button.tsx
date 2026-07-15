import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual emphasis. `primary` uses the theme accent; `danger` is destructive. */
  variant?: 'default' | 'primary' | 'danger';
  /** `sm` is the compact height; `md` is the default. */
  size?: 'sm' | 'md';
  /** Square icon-only button (no horizontal padding). */
  icon?: boolean;
  children?: ReactNode;
}

/** Cyber terminal button — uppercase, pixel-corner accent, neon hover glow. */
export function Button({
  variant = 'default',
  size = 'md',
  icon = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'cd-btn',
        variant !== 'default' && `cd-btn--${variant}`,
        size === 'sm' && 'cd-btn--sm',
        icon && 'cd-btn--icon',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
