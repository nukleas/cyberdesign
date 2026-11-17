import { useEffect, useId, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Content of the trigger button (text or an icon — not another control). */
  trigger: ReactNode;
  /** Classes for the trigger button (e.g. `cd-btn cd-btn--sm`). @default 'cd-btn' */
  triggerClassName?: string;
  /** Uncontrolled open. */
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Content placement. @default 'bottom' */
  side?: 'top' | 'bottom' | 'bottom-end' | 'right';
  /** Heading; it names the panel. */
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

/**
 * Click-triggered floating panel — a non-modal disclosure.
 *
 * Enter, Space or a click on the trigger toggles it. Focus stays on the
 * trigger and the panel is next in the tab order, so Tab walks into it and on
 * out of it; it closes when focus leaves, on a press outside, and on Escape,
 * which also returns focus to the trigger.
 */
export function Popover({
  trigger,
  triggerClassName = 'cd-btn',
  defaultOpen = false,
  open,
  onOpenChange,
  side = 'bottom',
  title,
  description,
  className = '',
  children,
  onBlur,
  ...rest
}: PopoverProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const isOpen = open ?? internal;
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const contentId = useId();
  const titleId = useId();

  const setOpen = (next: boolean) => {
    if (open == null) setInternal(next);
    onOpenChange?.(next);
  };
  // Read through a ref so the listeners below are not re-bound on every render.
  const close = useRef(() => setOpen(false));
  close.current = () => setOpen(false);

  // Out of reach the moment it closes, not only once the CSS fade-out has hidden it.
  useEffect(() => {
    if (content.current) content.current.inert = !isOpen;
  }, [isOpen]);

  useEffect(() => {
    const el = root.current;
    if (!isOpen || !el) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!el.contains(e.target as Node)) close.current();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      close.current();
      // With focus inside, this Escape was meant for the popover: it stops
      // here, so an enclosing dialog stays open, and the trigger gets focus.
      if (el.contains(document.activeElement)) {
        e.stopPropagation();
        button.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    // On the popover, which hears the key before an enclosing dialog does, and
    // on the document for when focus is elsewhere (Safari does not focus a
    // clicked button).
    el.addEventListener('keydown', onKeyDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const sideClass =
    side === 'top'
      ? 'cd-popover__content--top'
      : side === 'right'
        ? 'cd-popover__content--right'
        : side === 'bottom-end'
          ? 'cd-popover__content--bottom-end'
          : 'cd-popover__content--bottom';

  return (
    <div
      ref={root}
      className={cn('cd-popover', isOpen && 'is-open', className)}
      {...rest}
      onBlur={(e) => {
        onBlur?.(e);
        // Focus moved on to another element: the panel does not stay open behind it.
        if (isOpen && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        className={triggerClassName}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setOpen(!isOpen)}
      >
        {trigger}
      </button>
      <div
        ref={content}
        id={contentId}
        className={cn('cd-popover__content', sideClass)}
        role={title != null ? 'group' : undefined}
        aria-labelledby={title != null ? titleId : undefined}
      >
        {title != null && (
          <div id={titleId} className="cd-popover__title">
            {title}
          </div>
        )}
        {description != null && <p className="cd-popover__description">{description}</p>}
        {children}
      </div>
    </div>
  );
}
