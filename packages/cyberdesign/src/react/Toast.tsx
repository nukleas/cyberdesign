import type { HTMLAttributes, ReactNode } from 'react';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Semantic color. `accent` follows the active theme accent. */
  variant?: 'info' | 'success' | 'warning' | 'error' | 'accent';
  /** Leading glyph (e.g. ℹ ✓ ⚠ ✕ ⬡). */
  icon?: ReactNode;
  /** Bold uppercase heading line. */
  title?: ReactNode;
  /** When provided, renders a dismiss ✕ that calls this on click. */
  onDismiss?: () => void;
  /** Message body. */
  children?: ReactNode;
}

/** Single notification toast — semantic color, icon, title/body and optional dismiss. */
export function Toast({
  variant = 'info',
  icon,
  title,
  onDismiss,
  className = '',
  children,
  ...rest
}: ToastProps) {
  return (
    <div className={cx('cd-toast', `cd-toast--${variant}`, className)} {...rest}>
      {icon != null && <span className="cd-toast__icon">{icon}</span>}
      <div className="cd-toast__content">
        {title != null && <div className="cd-toast__title">{title}</div>}
        {children != null && <div className="cd-toast__body">{children}</div>}
      </div>
      {onDismiss && (
        <button className="cd-toast__dismiss" onClick={onDismiss} aria-label="Dismiss">
          ✕
        </button>
      )}
    </div>
  );
}
