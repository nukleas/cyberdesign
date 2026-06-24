import type { HTMLAttributes, ReactNode } from 'react';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Controls visibility — adds `is-open` to animate the overlay/panel in. */
  open: boolean;
  /** Fired by the backdrop click, the ✕ close button, and Escape handlers you wire up. */
  onClose?: () => void;
  /** Uppercase accent heading rendered in the header. Omit to hide the header. */
  title?: ReactNode;
  /** Footer content (typically action buttons). Omit to hide the footer. */
  footer?: ReactNode;
  /** Panel width. `default` is 480px; `sm` 340px, `lg` 680px, `xl` 900px. */
  size?: 'default' | 'sm' | 'lg' | 'xl';
  /** Hide the header ✕ close button. */
  hideClose?: boolean;
  /** Dialog body content. */
  children?: ReactNode;
}

/** Centered modal dialog over a dimmed backdrop — controlled via `open` / `onClose`. */
export function Modal({
  open,
  onClose,
  title,
  footer,
  size = 'default',
  hideClose = false,
  className = '',
  children,
  ...rest
}: ModalProps) {
  return (
    <div
      className={cx('cd-modal-overlay', open && 'is-open')}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className={cx('cd-modal', size !== 'default' && `cd-modal--${size}`, className)}
        role="dialog"
        aria-modal="true"
        {...rest}
      >
        {(title != null || !hideClose) && (
          <div className="cd-modal__header">
            {title != null && <span className="cd-modal__title">{title}</span>}
            {!hideClose && (
              <button className="cd-modal__close" onClick={onClose} aria-label="Close">
                ✕
              </button>
            )}
          </div>
        )}
        <div className="cd-modal__body">{children}</div>
        {footer != null && <div className="cd-modal__footer">{footer}</div>}
      </div>
    </div>
  );
}
