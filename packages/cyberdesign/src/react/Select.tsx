import type { ReactNode, SelectHTMLAttributes } from 'react';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** `sm` is the compact height; default is the standard height. */
  size?: 'sm' | 'md';
  /** Uppercase tracked label styling (viz-controls pattern). */
  label?: boolean;
  /** Error state — red border. */
  error?: boolean;
  /** `<option>` elements. */
  children?: ReactNode;
}

/** Native select with custom neon chevron — wraps the element for the arrow. */
export function Select({
  size = 'md',
  label = false,
  error = false,
  className = '',
  style,
  children,
  ...rest
}: SelectProps) {
  return (
    // `style` sizes the wrapper, which the select fills, so the chevron stays
    // inside the field whatever width is given.
    <div className="cd-select-wrap" style={style}>
      <select
        className={cx(
          'cd-select',
          size === 'sm' && 'cd-select--sm',
          label && 'cd-select--label',
          error && 'cd-select--error',
          className,
        )}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}
