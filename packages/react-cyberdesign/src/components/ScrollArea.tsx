import { useRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useScrollTabStop } from '../lib/useScrollTabStop';

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** Thin neon scrollbar styling. @default true */
  thin?: boolean;
  children?: ReactNode;
}

/**
 * Scrollable region with optional thin cyber scrollbar.
 *
 * While its content overflows and holds nothing focusable, the region is a Tab
 * stop (`tabIndex={0}`, `role="group"`) so the arrow keys, PageUp / PageDown,
 * Home / End and Space can scroll it; name it with `aria-label` or
 * `aria-labelledby`. A region that fits its content, or that contains a
 * focusable element, adds no Tab stop.
 */
export function ScrollArea({
  thin = true,
  className = '',
  children,
  ...rest
}: ScrollAreaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tabStop = useScrollTabStop(ref);
  return (
    <div
      ref={ref}
      className={cn('cd-scroll-area', thin && 'cd-scroll-area--thin', className)}
      {...(tabStop && { tabIndex: 0, role: 'group' })}
      {...rest}
    >
      {children}
    </div>
  );
}
