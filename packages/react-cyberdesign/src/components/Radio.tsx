import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Text shown beside the dot. When set, wraps the input in a `cd-control` label. */
  label?: ReactNode;
  /** Smaller helper line below the label. */
  description?: ReactNode;
}

/**
 * Cyber radio — neon filled dot; renders inside a `cd-control` label when labelled.
 *
 * Keyboard: a native radio input. Radios sharing a `name` form one Tab stop;
 * arrow keys move between them and check, Space checks the focused one.
 */
export function Radio({ label, description, className = '', ...rest }: RadioProps) {
  const input = (
    <input type="radio" className={cn('cd-radio', !label && className)} {...rest} />
  );

  if (label == null && description == null) return input;

  return (
    <label className={cn('cd-control', className)}>
      <input type="radio" className="cd-radio" {...rest} />
      <span className="cd-control__label">
        {label}
        {description != null && <span className="cd-control__desc">{description}</span>}
      </span>
    </label>
  );
}
