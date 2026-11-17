import { useEffect, useId, useRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useOverlayFocus } from '../lib/focus';

export interface SheetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Controls visibility. */
  open: boolean;
  /** Fired by Escape, a backdrop press and the ✕ close button. */
  onClose?: () => void;
  /** Edge the panel slides from. @default 'right' */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Panel width for left/right. */
  size?: 'sm' | 'default' | 'lg';
  /** Heading; it names the dialog (`aria-labelledby`). Without one, pass `aria-label`. */
  title?: ReactNode;
  /** Text under the heading; it is announced as the dialog's description. */
  description?: ReactNode;
  footer?: ReactNode;
  hideClose?: boolean;
  children?: ReactNode;
}

/**
 * Side/bottom sheet panel over a dimmed backdrop — a modal dialog.
 *
 * Opening moves focus to the first control inside (the panel itself when there
 * is none); Tab and Shift+Tab cycle within the sheet; Escape calls `onClose`;
 * closing returns focus to the element that opened it. While closed, its
 * content is out of the tab order.
 */
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
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  // Out of reach the moment it closes, not only once the CSS slide-out has hidden it.
  useEffect(() => {
    if (panel.current) panel.current.inert = !open;
  }, [open]);
  useOverlayFocus(panel, open, onClose);

  return (
    <div
      className={cn('cd-sheet-overlay', open && 'is-open')}
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
        className={cn(
          'cd-sheet',
          `cd-sheet--${side}`,
          size !== 'default' && `cd-sheet--${size}`,
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title != null ? titleId : undefined}
        aria-describedby={description != null ? descriptionId : undefined}
        tabIndex={-1}
        {...rest}
      >
        {(title != null || description != null || !hideClose) && (
          <div className="cd-sheet__header">
            <div>
              {title != null && (
                <div id={titleId} className="cd-sheet__title">
                  {title}
                </div>
              )}
              {description != null && (
                <p id={descriptionId} className="cd-sheet__description">
                  {description}
                </p>
              )}
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
