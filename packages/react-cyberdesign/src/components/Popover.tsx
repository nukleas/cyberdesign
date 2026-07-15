import { useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Trigger node. */
  trigger: ReactNode;
  /** Uncontrolled open. */
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Content placement. @default 'bottom' */
  side?: 'top' | 'bottom' | 'bottom-end' | 'right';
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

/** Click-triggered floating panel. */
export function Popover({
  trigger,
  defaultOpen = false,
  open,
  onOpenChange,
  side = 'bottom',
  title,
  description,
  className = '',
  children,
  ...rest
}: PopoverProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const isOpen = open ?? internal;

  const setOpen = (next: boolean) => {
    if (open == null) setInternal(next);
    onOpenChange?.(next);
  };

  const sideClass =
    side === 'top'
      ? 'cd-popover__content--top'
      : side === 'right'
        ? 'cd-popover__content--right'
        : side === 'bottom-end'
          ? 'cd-popover__content--bottom-end'
          : 'cd-popover__content--bottom';

  return (
    <div className={cn('cd-popover', isOpen && 'is-open', className)} {...rest}>
      <button type="button" onClick={() => setOpen(!isOpen)} aria-expanded={isOpen}>
        {trigger}
      </button>
      <div className={cn('cd-popover__content', sideClass)} role="dialog">
        {title != null && <div className="cd-popover__title">{title}</div>}
        {description != null && <p className="cd-popover__description">{description}</p>}
        {children}
      </div>
    </div>
  );
}
