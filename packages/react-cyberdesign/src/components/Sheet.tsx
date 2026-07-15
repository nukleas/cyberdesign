import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface SheetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Controls visibility. */
  open: boolean;
  onClose?: () => void;
  /** Edge the panel slides from. @default 'right' */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Panel width for left/right. */
  size?: 'sm' | 'default' | 'lg';
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  hideClose?: boolean;
  children?: ReactNode;
}

/** Side/bottom sheet panel over a dimmed backdrop. */
export function Sheet({
  open,
  onClose,
  side = 'right',
  size = 'default',
  title,
  description,
  footer,
  hideClose = false,
  className = '',
  children,
  ...rest
}: SheetProps) {
  return (
    <div
      className={cn('cd-sheet-overlay', open && 'is-open')}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className={cn(
          'cd-sheet',
          `cd-sheet--${side}`,
          size !== 'default' && `cd-sheet--${size}`,
          className,
        )}
        role="dialog"
        aria-modal="true"
        {...rest}
      >
        {(title != null || description != null || !hideClose) && (
          <div className="cd-sheet__header">
            <div>
              {title != null && <div className="cd-sheet__title">{title}</div>}
              {description != null && <p className="cd-sheet__description">{description}</p>}
            </div>
            {!hideClose && (
              <button type="button" className="cd-sheet__close" onClick={onClose} aria-label="Close">
                ✕
              </button>
            )}
          </div>
        )}
        <div className="cd-sheet__body">{children}</div>
        {footer != null && <div className="cd-sheet__footer">{footer}</div>}
      </div>
    </div>
  );
}
