import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'content'> {
  /** Tooltip text shown on hover (rendered via the `data-tip` attribute). */
  tip: string;
  /** Show the tooltip below the trigger instead of above. */
  below?: boolean;
  /** The trigger content the tooltip wraps. */
  children?: ReactNode;
}

/** CSS-only tooltip — wraps a trigger and reveals `tip` text on hover. */
export function Tooltip({
  tip,
  below = false,
  className = '',
  children,
  ...rest
}: TooltipProps) {
  return (
    <span
      className={cn('cd-tooltip', below && 'cd-tooltip--below', className)}
      data-tip={tip}
      {...rest}
    >
      {children}
    </span>
  );
}
