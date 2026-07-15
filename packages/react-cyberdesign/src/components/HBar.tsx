import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface HBarProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  /** 0–100 fill percent. */
  value: number;
  /** Optional numeric readout (defaults to value). */
  display?: ReactNode;
  /** CSS color for the fill (defaults to accent). */
  color?: string;
}

/**
 * Labeled horizontal bar — ocint "BY CATEGORY" breakdown rows.
 */
export function HBar({
  label,
  value,
  display,
  color,
  className = '',
  ...rest
}: HBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  const fillStyle: CSSProperties = {
    width: `${pct}%`,
    ...(color ? { background: color } : null),
  };

  return (
    <div className={cn('cd-hbar-row', className)} {...rest}>
      <span className="cd-hbar-row__label">{label}</span>
      <div className="cd-hbar-row__track">
        <div className="cd-hbar-row__fill" style={fillStyle} />
      </div>
      <span className="cd-hbar-row__value">{display ?? Math.round(pct)}</span>
    </div>
  );
}
