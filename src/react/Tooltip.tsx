import type { HTMLAttributes, ReactNode } from 'react';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

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
      className={cx('cd-tooltip', below && 'cd-tooltip--below', className)}
      data-tip={tip}
      {...rest}
    >
      {children}
    </span>
  );
}
