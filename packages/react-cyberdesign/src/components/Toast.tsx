import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Progress } from './Progress';

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
  /**
   * Progress bar under the text for a long job: a percentage (0–100), or
   * `'indeterminate'` for a phase with no measure. Omit for no bar.
   */
  progress?: number | 'indeterminate';
  /** Action buttons under the text (e.g. Cancel, Restart, Open) — pass `<Button size="sm">`. */
  actions?: ReactNode;
}

/** Single notification toast — semantic color, icon, title/body, optional progress bar, actions and dismiss. */
export function Toast({
  variant = 'info',
  icon,
  title,
  onDismiss,
  className = '',
  children,
  progress,
  actions,
  ...rest
}: ToastProps) {
  const labelId = useId();
  return (
    <div className={cn('cd-toast', `cd-toast--${variant}`, className)} {...rest}>
      {icon != null && <span className="cd-toast__icon">{icon}</span>}
      <div className="cd-toast__content">
        {title != null && (
          <div className="cd-toast__title" id={labelId}>
            {title}
          </div>
        )}
        {children != null && (
          <div className="cd-toast__body" id={title == null ? labelId : undefined}>
            {children}
          </div>
        )}
        {progress != null && (
          <Progress
            className="cd-toast__progress"
            value={progress === 'indeterminate' ? undefined : progress}
            indeterminate={progress === 'indeterminate'}
            aria-labelledby={title != null || children != null ? labelId : undefined}
          />
        )}
        {actions != null && <div className="cd-toast__actions">{actions}</div>}
      </div>
      {onDismiss && (
        <button className="cd-toast__dismiss" onClick={onDismiss} aria-label="Dismiss">
          ✕
        </button>
      )}
    </div>
  );
}
