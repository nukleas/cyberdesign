import type { HTMLAttributes, ReactNode } from 'react';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

/** Status color for a segment value — maps to `cd-hud-segment__value--*`. */
export type HudSegmentStatus = 'ok' | 'warn' | 'err';

export interface HudSegmentProps extends HTMLAttributes<HTMLDivElement> {
  /** Small uppercase caption. */
  label?: ReactNode;
  /** Accent-colored value. */
  value?: ReactNode;
  /** Color the value by status. */
  status?: HudSegmentStatus;
  children?: ReactNode;
}

/** One label/value cell inside a `HudBar`. */
export function HudSegment({
  label,
  value,
  status,
  className = '',
  children,
  ...rest
}: HudSegmentProps) {
  return (
    <div className={cx('cd-hud-segment', className)} {...rest}>
      {label != null && <span className="cd-hud-segment__label">{label}</span>}
      {value != null && (
        <span className={cx('cd-hud-segment__value', status && `cd-hud-segment__value--${status}`)}>
          {value}
        </span>
      )}
      {children}
    </div>
  );
}

export interface HudBarSegment {
  /** Small uppercase caption. */
  label?: ReactNode;
  /** Accent-colored value. */
  value?: ReactNode;
  /** Color the value by status. */
  status?: HudSegmentStatus;
}

export interface HudBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Data-driven segments rendered left-to-right. */
  segments?: HudBarSegment[];
  /** Glowing accent edge: `top` or `bottom` bar, or `side` for vertical. */
  position?: 'top' | 'bottom' | 'side';
  /** Tighter segment padding/type. */
  compact?: boolean;
  /** Custom segment markup (e.g. `HudSegment` children) instead of `segments`. */
  children?: ReactNode;
}

/** Persistent HUD status bar — a row of label/value segments with a glowing accent edge. */
export function HudBar({
  segments,
  position,
  compact = false,
  className = '',
  children,
  ...rest
}: HudBarProps) {
  return (
    <div
      className={cx(
        'cd-hud-bar',
        position && `cd-hud-bar--${position}`,
        compact && 'cd-hud-bar--compact',
        className,
      )}
      {...rest}
    >
      {segments?.map((seg, i) => (
        <HudSegment key={i} label={seg.label} value={seg.value} status={seg.status} />
      ))}
      {children}
    </div>
  );
}
