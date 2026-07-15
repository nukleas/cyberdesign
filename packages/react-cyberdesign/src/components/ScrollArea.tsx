import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** Thin neon scrollbar styling. @default true */
  thin?: boolean;
  children?: ReactNode;
}

/** Scrollable region with optional thin cyber scrollbar. */
export function ScrollArea({
  thin = true,
  className = '',
  children,
  ...rest
}: ScrollAreaProps) {
  return (
    <div className={cn('cd-scroll-area', thin && 'cd-scroll-area--thin', className)} {...rest}>
      {children}
    </div>
  );
}
