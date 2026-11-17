import { useEffect, useId, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface HoverCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Trigger content (text, an avatar — not another control). It is wrapped in
   * a focusable element, so the card is reachable with Tab.
   */
  trigger: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

/**
 * Card revealed while its trigger is hovered or focused.
 *
 * Tab to the trigger to open it; Tab away or press Escape to close it. The
 * card is the trigger's description (`aria-describedby`), so it is announced
 * with it.
 */
export function HoverCard({
  trigger,
  title,
  description,
  className = '',
  children,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...rest
}: HoverCardProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();

  // On the document, so Escape also dismisses a card that is only hovered.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      // With focus on the card this Escape was meant for it: an enclosing dialog stays open.
      if (root.current?.contains(document.activeElement)) e.stopPropagation();
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [open]);

  return (
    <div
      ref={root}
      className={cn('cd-hover-card', open && 'is-open', className)}
      {...rest}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        setOpen(true);
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        setOpen(false);
      }}
      onFocus={(e) => {
        onFocus?.(e);
        setOpen(true);
      }}
      onBlur={(e) => {
        onBlur?.(e);
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <span tabIndex={0} aria-describedby={id}>
        {trigger}
      </span>
      <div id={id} className="cd-hover-card__content" role="tooltip">
        {title != null && <div className="cd-popover__title">{title}</div>}
        {description != null && <p className="cd-popover__description">{description}</p>}
        {children}
      </div>
    </div>
  );
}
