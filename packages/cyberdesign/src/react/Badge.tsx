import type { HTMLAttributes, ReactNode } from 'react';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

type CdColor =
  | 'orange' | 'amber' | 'gold' | 'cyan' | 'magenta'
  | 'green' | 'red' | 'blue' | 'purple' | 'yellow';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** Color variant. Defaults to `orange`. */
  color?: CdColor;
  children?: ReactNode;
}

/** Inline status badge — uppercase, pixel-corner, with a neon color variant. */
export function Badge({
  color = 'orange',
  className = '',
  children,
  ...rest
}: BadgeProps) {
  return (
    <span className={cx('cd-badge', `cd-badge--${color}`, className)} {...rest}>
      {children}
    </span>
  );
}
