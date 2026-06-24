import type { InputHTMLAttributes, ReactNode } from 'react';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Text shown beside the dot. When set, wraps the input in a `cd-control` label. */
  label?: ReactNode;
  /** Smaller helper line below the label. */
  description?: ReactNode;
}

/** Cyber radio — neon filled dot; renders inside a `cd-control` label when labelled. */
export function Radio({ label, description, className = '', ...rest }: RadioProps) {
  const input = (
    <input type="radio" className={cx('cd-radio', !label && className)} {...rest} />
  );

  if (label == null && description == null) return input;

  return (
    <label className={cx('cd-control', className)}>
      <input type="radio" className="cd-radio" {...rest} />
      <span className="cd-control__label">
        {label}
        {description != null && <span className="cd-control__desc">{description}</span>}
      </span>
    </label>
  );
}
