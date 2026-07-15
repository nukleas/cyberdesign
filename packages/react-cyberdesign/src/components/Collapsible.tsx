import { useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface CollapsibleProps extends HTMLAttributes<HTMLDivElement> {
  /** Trigger label. */
  trigger: ReactNode;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

/** Expand/collapse section with a trigger row. */
export function Collapsible({
  trigger,
  defaultOpen = false,
  open,
  onOpenChange,
  className = '',
  children,
  ...rest
}: CollapsibleProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const isOpen = open ?? internal;

  const toggle = () => {
    const next = !isOpen;
    if (open == null) setInternal(next);
    onOpenChange?.(next);
  };

  return (
    <div className={cn('cd-collapsible', isOpen && 'is-open', className)} {...rest}>
      <button type="button" className="cd-collapsible__trigger" onClick={toggle} aria-expanded={isOpen}>
        <span>{trigger}</span>
        <span className="cd-collapsible__chevron" aria-hidden>
          ▾
        </span>
      </button>
      <div className="cd-collapsible__content">{children}</div>
    </div>
  );
}
