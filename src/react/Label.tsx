import type { LabelHTMLAttributes, ReactNode } from 'react';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Append a red required asterisk. */
  required?: boolean;
  children?: ReactNode;
}

/** Uppercase form label — optional required asterisk. */
export function Label({
  required = false,
  className = '',
  children,
  ...rest
}: LabelProps) {
  return (
    <label
      className={cx(
        'cd-form-label',
        required && 'cd-form-label--required',
        className,
      )}
      {...rest}
    >
      {children}
    </label>
  );
}
