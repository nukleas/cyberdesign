import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Stack buttons vertically. */
  vertical?: boolean;
  children?: ReactNode;
}

/** Groups adjacent `Button` children with shared borders. */
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
