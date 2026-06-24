import type { HTMLAttributes } from 'react';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Fill percentage (0–100). Ignored when `indeterminate`. */
  value?: number;
  /** Color variant. Default uses the theme accent. */
  variant?: 'default' | 'danger' | 'success' | 'warning';
  /** Taller 8px bar. */
  thick?: boolean;
  /** Scanning/indeterminate animation (no fixed value). */
  indeterminate?: boolean;
}

/** Progress bar — accent fill driven by `value`%, with color, thick, and indeterminate variants. */
export function Progress({
  value = 0,
  variant = 'default',
  thick = false,
  indeterminate = false,
  className = '',
  ...rest
}: ProgressProps) {
  return (
    <div
      className={cx(
        'cd-progress',
        variant !== 'default' && `cd-progress--${variant}`,
        thick && 'cd-progress--thick',
        indeterminate && 'cd-progress--indeterminate',
        className,
      )}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={100}
      {...rest}
    >
      <div
        className="cd-progress__bar"
        style={indeterminate ? undefined : { width: `${value}%` }}
      />
    </div>
  );
}
