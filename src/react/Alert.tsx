import type { HTMLAttributes, ReactNode } from 'react';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Semantic color. `accent` follows the active theme accent. */
  variant?: 'info' | 'success' | 'warning' | 'error' | 'accent';
  /** Compact padding/type. */
  size?: 'sm';
  /** Drop the left accent bar for a flatter inline banner. */
  inline?: boolean;
  /** Bold uppercase heading line. */
  title?: ReactNode;
  /** Leading glyph (e.g. ℹ ✓ ⚠ ✕ ⬡). */
  icon?: ReactNode;
  /** When provided, renders a dismiss ✕ that calls this on click. */
  onDismiss?: () => void;
  /** Body text. */
  children?: ReactNode;
}

/** Banner / alert with semantic color, optional icon, title and dismiss. */
export function Alert({
  variant = 'info',
  size,
  inline = false,
  title,
  icon,
  onDismiss,
  className = '',
  children,
  ...rest
}: AlertProps) {
  return (
    <div
      className={cx(
        'cd-alert',
        `cd-alert--${variant}`,
        size === 'sm' && 'cd-alert--sm',
        inline && 'cd-alert--inline',
        className,
      )}
      {...rest}
    >
      {icon != null && <span className="cd-alert__icon">{icon}</span>}
      <div className="cd-alert__content">
        {title != null && <div className="cd-alert__title">{title}</div>}
        {children != null && <div className="cd-alert__body">{children}</div>}
      </div>
      {onDismiss && (
        <button className="cd-alert__dismiss" onClick={onDismiss} aria-label="Dismiss">
          ✕
        </button>
      )}
    </div>
  );
}
