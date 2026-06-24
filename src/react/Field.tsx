import type { HTMLAttributes, ReactNode } from 'react';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  /** Inline layout: label left, control right. */
  inline?: boolean;
  /** Helper / description text below the control. */
  description?: ReactNode;
  /** Error message below the control (rendered with a ⚠ marker). */
  error?: ReactNode;
  /** Label + control (e.g. a `Label` followed by an input). */
  children?: ReactNode;
}

/** Form field wrapper — stacks a label, control, and optional helper/error text. */
export function Field({
  inline = false,
  description,
  error,
  className = '',
  children,
  ...rest
}: FieldProps) {
  return (
    <div
      className={cx('cd-field', inline && 'cd-field--inline', className)}
      {...rest}
    >
      {children}
      {description != null && <p className="cd-field-desc">{description}</p>}
      {error != null && <p className="cd-field-error">{error}</p>}
    </div>
  );
}
