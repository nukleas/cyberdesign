import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

/** Status color for a HUD value readout — maps to `cd-hud__value--*`. */
export type HudValueStatus = 'ok' | 'warn' | 'err' | 'dim';

export interface HudFrameProps extends HTMLAttributes<HTMLDivElement> {
  /** Uppercase label line above the value. */
  label?: ReactNode;
  /** Primary readout value. */
  value?: ReactNode;
  /** Color the value by status. */
  status?: HudValueStatus;
  /** Tighter padding for dense UIs. */
  compact?: boolean;
  /** Frosted / AR-style translucent backdrop. */
  floating?: boolean;
  /** Extra content rendered after the label/value (e.g. nested gauges). */
  children?: ReactNode;
}

/** Framed HUD stat panel — uppercase label over a glowing accent value readout. */
export function HudFrame({
  label,
  value,
  status,
  compact = false,
  floating = false,
  className = '',
  children,
  ...rest
}: HudFrameProps) {
  return (
    <div
      className={cn(
        'cd-hud-frame',
        compact && 'cd-hud--compact',
        floating && 'cd-hud--floating',
        className,
      )}
      {...rest}
    >
      {label != null && <div className="cd-hud__label">{label}</div>}
      {value != null && (
        <div className={cn('cd-hud__value', status && `cd-hud__value--${status}`)}>{value}</div>
      )}
      {children}
    </div>
  );
}
