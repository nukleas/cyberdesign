import { useEffect, useId, useRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useOverlayFocus } from '../lib/focus';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Controls visibility — adds `is-open` to animate the overlay/panel in. */
  open: boolean;
  /** Fired by Escape, a backdrop press and the ✕ close button. */
  onClose?: () => void;
  /**
   * Uppercase accent heading rendered in the header; it names the dialog
   * (`aria-labelledby`). Without one, pass `aria-label`.
   */
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

/**
 * Centered modal dialog over a dimmed backdrop — controlled via `open` / `onClose`.
 *
 * Opening moves focus to the first control inside (the panel itself when there
 * is none); Tab and Shift+Tab cycle within the dialog; Escape calls `onClose`;
 * closing returns focus to the element that opened it. While closed, its
 * content is out of the tab order.
 */
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
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  // Out of reach the moment it closes, not only once the CSS fade-out has hidden it.
  useEffect(() => {
    if (panel.current) panel.current.inert = !open;
  }, [open]);
  useOverlayFocus(panel, open, onClose);

  return (
    <div
      className={cn('cd-modal-overlay', open && 'is-open')}
      // A backdrop press must not drop focus onto <body>, outside the Tab cycle.
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        ref={panel}
        className={cn('cd-modal', size !== 'default' && `cd-modal--${size}`, className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        tabIndex={-1}
        {...rest}
      >
        {(title != null || !hideClose) && (
          <div className="cd-modal__header">
            {title != null && (
              <span id={titleId} className="cd-modal__title">
                {title}
              </span>
            )}
            {!hideClose && (
              <button type="button" className="cd-modal__close" onClick={onClose} aria-label="Close">
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
