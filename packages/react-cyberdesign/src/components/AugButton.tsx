import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface AugButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `primary` fills with the accent-subtle background and a drop-shadow glow. */
  variant?: 'default' | 'primary';
  /** `sm` and `lg` adjust height, padding and clip size; `md` is the default. */
  size?: 'sm' | 'md' | 'lg';
  /** Reverse the diagonal clip to cut the TR+BL corners instead of TL+BR. */
  reverse?: boolean;
  children?: ReactNode;
}

/** Augmented clip-path button — neon-bordered diagonal-corner button matching cd-aug-btn. */
export function AugButton({
  variant = 'default',
  size = 'md',
  reverse = false,
  className = '',
  children,
  ...rest
}: AugButtonProps) {
  return (
    <button
      className={cn(
        'cd-aug-btn',
        variant === 'primary' && 'cd-aug-btn--primary',
        size === 'sm' && 'cd-aug-btn--sm',
        size === 'lg' && 'cd-aug-btn--lg',
        reverse && 'cd-aug-btn--rev',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
