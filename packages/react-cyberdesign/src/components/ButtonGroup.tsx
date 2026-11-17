import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Stack buttons vertically. */
  vertical?: boolean;
  children?: ReactNode;
}

/**
 * Groups adjacent `Button` children with shared borders.
 *
 * Keyboard: a plain `role="group"` of native buttons — each button is its own
 * Tab stop and Enter / Space activate it. There are no arrow keys; for a single
 * Tab stop with roving focus use `ToggleGroup`.
 */
export function ButtonGroup({
  vertical = false,
  className = '',
  children,
  ...rest
}: ButtonGroupProps) {
  return (
    <div
      className={cn('cd-btn-group', vertical && 'cd-btn-group--vertical', className)}
      role="group"
      {...rest}
    >
      {children}
    </div>
  );
}
