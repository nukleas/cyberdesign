import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { HTMLAttributes, ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';

/** Hover delay before the bubble appears (keyboard focus shows it at once). */
const SHOW_DELAY = 300;
/** Distance between trigger and bubble; the CSS arrow sits in this gap. */
const GAP = 8;
/** Minimum distance kept between the bubble and the viewport edge. */
const EDGE = 8;
/** Closest the arrow's centre may get to a bubble corner. */
const ARROW_INSET = 10;

type Side = 'top' | 'bottom';

export interface TooltipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Tooltip content. Nothing is shown when it is empty (`null`, `false`, `''`). */
  tip: ReactNode;
  /**
   * Preferred side of the trigger. The bubble flips to the other side when
   * the preferred one has no room.
   * @default 'top'
   */
  side?: Side;
  /**
   * The trigger. A single element child receives `aria-describedby` while
   * the tooltip is shown, so make it the focusable control itself.
   */
  children?: ReactNode;
}

interface Placement {
  side: Side;
  top: number;
  left: number;
  arrowLeft: number;
  /** `theme-*` class of the trigger's theme scope — a body-level bubble is outside it. */
  theme: string | undefined;
}

function place(trigger: HTMLElement, bubble: HTMLElement, preferred: Side): Placement {
  const rect = trigger.getBoundingClientRect();
  const { width, height } = bubble.getBoundingClientRect();
  const viewport = document.documentElement;

  const fitsTop = rect.top - GAP - height >= EDGE;
  const fitsBottom = rect.bottom + GAP + height <= viewport.clientHeight - EDGE;
  const side: Side =
    preferred === 'top' ? (fitsTop || !fitsBottom ? 'top' : 'bottom') : fitsBottom || !fitsTop ? 'bottom' : 'top';

  const centre = rect.left + rect.width / 2;
  const left = Math.max(EDGE, Math.min(centre - width / 2, viewport.clientWidth - width - EDGE));
  const arrow = Math.max(ARROW_INSET, Math.min(centre - left, width - ARROW_INSET));

  const scope = trigger.closest('[class*="theme-"]');

  return {
    side,
    // When neither side has room the bubble stays on screen and overlaps the trigger.
    top: Math.max(EDGE, side === 'top' ? rect.top - GAP - height : rect.bottom + GAP),
    left,
    // The arrow is positioned from the bubble's padding box, inside its border.
    arrowLeft: arrow - bubble.clientLeft,
    theme: scope ? Array.from(scope.classList).find((c) => c.startsWith('theme-')) : undefined,
  };
}

function hasKeyboardFocus(el: HTMLElement): boolean {
  const active = document.activeElement;
  return active != null && el.contains(active) && active.matches(':focus-visible');
}

interface TooltipBubbleProps {
  id: string;
  triggerRef: RefObject<HTMLElement | null>;
  side: Side;
  onClose: () => void;
  children: ReactNode;
}

/** The body-level bubble. Mounted only while the tooltip is shown. */
function TooltipBubble({ id, triggerRef, side, onClose, children }: TooltipBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<Placement | null>(null);

  const update = useCallback(() => {
    if (triggerRef.current && bubbleRef.current) {
      setPlacement(place(triggerRef.current, bubbleRef.current, side));
    }
  }, [triggerRef, side]);

  // Measure before paint, and again whenever the content changes size.
  useLayoutEffect(update, [update, children]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    // A hovered trigger that moves has left the pointer, so the hint goes. A
    // keyboard-focused one keeps its hint (focusing it may be what scrolled
    // it into view), so the bubble follows instead.
    const onMove = () => {
      const trigger = triggerRef.current;
      if (trigger && hasKeyboardFocus(trigger)) update();
      else onClose();
    };
    const onScroll = (e: Event) => {
      const trigger = triggerRef.current;
      if (trigger && e.target instanceof Node && e.target.contains(trigger)) onMove();
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onMove);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onMove);
    };
  }, [triggerRef, update, onClose]);

  return createPortal(
    <div
      ref={bubbleRef}
      id={id}
      role="tooltip"
      className={cn('cd-tooltip-float', `cd-tooltip-float--${placement?.side ?? side}`, placement?.theme)}
      style={placement ? { top: placement.top, left: placement.left } : undefined}
    >
      {children}
      <span
        className="cd-tooltip-float__arrow"
        style={placement ? { left: placement.arrowLeft } : undefined}
      />
    </div>,
    document.body,
  );
}

/**
 * Floating tooltip. The bubble renders at `document.body` and is positioned
 * from the trigger's bounding rect, so it is never clipped by an
 * `overflow` ancestor; it flips above/below and stays inside the viewport.
 *
 * Shows after a short delay on hover and immediately on keyboard focus;
 * hides on pointer leave, blur, Escape, pointer down, and scroll.
 *
 * ```tsx
 * <Tooltip tip="Copy to clipboard">
 *   <Button icon aria-label="Copy">⧉</Button>
 * </Tooltip>
 * ```
 */
export function Tooltip({
  tip,
  side = 'top',
  className = '',
  children,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onFocus,
  onBlur,
  ...rest
}: TooltipProps) {
  const id = useId();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const showAfterDelay = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), SHOW_DELAY);
  };
  const hide = useCallback(() => {
    window.clearTimeout(timer.current);
    setOpen(false);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const shown = open && tip != null && tip !== false && tip !== '';

  return (
    <span
      ref={triggerRef}
      className={cn('cd-tooltip-trigger', className)}
      {...rest}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        showAfterDelay();
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        hide();
      }}
      // Activating the control should not leave its hint painted over what comes next.
      onPointerDown={(e) => {
        onPointerDown?.(e);
        hide();
      }}
      onFocus={(e) => {
        onFocus?.(e);
        // Keyboard focus only: a mouse click also focuses, right after its pointerdown hid the
        // hint. No delay, so the description is linked by the time focus is announced.
        if (e.target.matches(':focus-visible')) {
          window.clearTimeout(timer.current);
          setOpen(true);
        }
      }}
      onBlur={(e) => {
        onBlur?.(e);
        hide();
      }}
    >
      {shown && isValidElement<{ 'aria-describedby'?: string }>(children)
        ? cloneElement(children, {
            'aria-describedby': cn(children.props['aria-describedby'], id),
          })
        : children}
      {shown && (
        <TooltipBubble id={id} triggerRef={triggerRef} side={side} onClose={hide}>
          {tip}
        </TooltipBubble>
      )}
    </span>
  );
}
