import type { InputHTMLAttributes, ReactNode } from 'react';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Text shown beside the box. When set, wraps the input in a `cd-control` label. */
  label?: ReactNode;
  /** Smaller helper line below the label. */
  description?: ReactNode;
}

/** Cyber checkbox — neon fill + checkmark; renders inside a `cd-control` label when labelled. */
export function Checkbox({ label, description, className = '', ...rest }: CheckboxProps) {
  const input = (
    <input type="checkbox" className={cx('cd-checkbox', !label && className)} {...rest} />
  );

  if (label == null && description == null) return input;

  return (
    <label className={cx('cd-control', className)}>
      <input type="checkbox" className="cd-checkbox" {...rest} />
      <span className="cd-control__label">
        {label}
        {description != null && <span className="cd-control__desc">{description}</span>}
      </span>
    </label>
  );
}
