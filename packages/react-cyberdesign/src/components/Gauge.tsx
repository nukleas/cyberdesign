import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface GaugeProps extends HTMLAttributes<HTMLDivElement> {
  /** Fill amount, 0–100. Drives the conic `--value` CSS variable. */
  value: number;
  /** Text shown in the center; defaults to `value`. */
  display?: ReactNode;
  /** Uppercase caption under the value. */
  label?: ReactNode;
  /** `small` is the compact radial. */
  size?: 'small';
  /** Color theme: accent (default), or a semantic override. */
  variant?: 'danger' | 'success' | 'warn';
  /** Concentric-ring radar style with sweep fill. */
  radar?: boolean;
  /** Extra center content (rendered after value/label). */
  children?: ReactNode;
}

/** Radial neon gauge — conic fill driven by a 0–100 `value`, with center readout. */
export function Gauge({
  value,
  display,
  label,
  size,
  variant,
  radar = false,
  className = '',
  style,
  children,
  ...rest
}: GaugeProps) {
  return (
    <div
      className={cn(
        'cd-gauge',
        size === 'small' && 'cd-gauge--small',
        variant && `cd-gauge--${variant}`,
        radar && 'cd-gauge--radar',
        className,
      )}
      style={{ ['--value']: value, ...style } as CSSProperties}
      {...rest}
    >
      <div className="cd-gauge__track" />
      <div className="cd-gauge__fill" />
      <div className="cd-gauge__center">
        <div className="cd-gauge__value">{display ?? value}</div>
        {label != null && <div className="cd-gauge__label">{label}</div>}
        {children}
      </div>
    </div>
  );
}
