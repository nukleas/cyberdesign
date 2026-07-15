import type { InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** `sm` is compact, `lg` is taller; default is the standard height. */
  size?: 'sm' | 'md' | 'lg';
  /** Adds a left accent border (corpus-search pattern). */
  accent?: boolean;
  /** Error state — red border and glow. */
  error?: boolean;
}

/** Cyber text input — neon focus ring, optional left-accent border and error state. */
export function Input({
  size = 'md',
  accent = false,
  error = false,
  className = '',
  type = 'text',
  ...rest
}: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        'cd-input',
        size === 'sm' && 'cd-input--sm',
        size === 'lg' && 'cd-input--lg',
        accent && 'cd-input--accent',
        error && 'cd-input--error',
        className,
      )}
      {...rest}
    />
  );
}
