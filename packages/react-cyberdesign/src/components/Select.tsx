import type { ReactNode, SelectHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** `sm` is the compact height; default is the standard height. */
  size?: 'sm' | 'md';
  /** Uppercase tracked label styling (viz-controls pattern). */
  label?: boolean;
  /** Error state — red border. */
  error?: boolean;
  /** `<option>` elements. */
  children?: ReactNode;
}

/** Native select with custom neon chevron — wraps the element for the arrow. */
export function Select({
  size = 'md',
  label = false,
  error = false,
  className = '',
  children,
  ...rest
}: SelectProps) {
  return (
    <div className="cd-select-wrap">
      <select
        className={cn(
          'cd-select',
          size === 'sm' && 'cd-select--sm',
          label && 'cd-select--label',
          error && 'cd-select--error',
          className,
        )}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}
