import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

/**
 * Keyboard focus helpers shared by every component with its own key handling:
 * roving focus for composite widgets (menus, tabs, toolbars, listboxes) and
 * focus containment for overlays (dialogs, sheets, popovers).
 */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Elements inside `root` that Tab can reach, in document order. Hidden ones are left out. */
export function tabbable(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden',
  );
}

export interface MoveFocusOptions {
  /**
   * Which arrow keys move: Up/Down (`vertical`), Left/Right (`horizontal`) or
   * all four (`both`). @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Wrap from the last item to the first and back. @default true */
  loop?: boolean;
}

/**
 * Roving focus: move focus among `items` for an arrow key, Home or End.
 *
 * Call it from a `keydown` handler with the widget's items in display order
 * (leave disabled ones out). Returns the item that received focus, after
 * calling `preventDefault`, or `null` when the key is not a movement key, so
 * the caller can go on to handle Enter, Escape and the rest.
 */
export function moveFocus(
  event: { key: string; preventDefault: () => void },
  items: HTMLElement[],
  { orientation = 'vertical', loop = true }: MoveFocusOptions = {},
): HTMLElement | null {
  if (items.length === 0) return null;
  const vertical = orientation !== 'horizontal';
  const horizontal = orientation !== 'vertical';
  const current = items.indexOf(document.activeElement as HTMLElement);
  const last = items.length - 1;

  let next: number;
  if ((vertical && event.key === 'ArrowDown') || (horizontal && event.key === 'ArrowRight')) {
    next = current < last ? current + 1 : loop ? 0 : last;
  } else if ((vertical && event.key === 'ArrowUp') || (horizontal && event.key === 'ArrowLeft')) {
    // From outside the items (current is -1), "previous" means the last one.
    next = current > 0 ? current - 1 : loop || current < 0 ? last : 0;
  } else if (event.key === 'Home') {
    next = 0;
  } else if (event.key === 'End') {
    next = last;
  } else {
    return null;
  }

  event.preventDefault();
  items[next].focus();
  return items[next];
}

/**
 * Focus containment for an overlay. While `open`:
 * focus moves into `ref` (its first tabbable element, else the container
 * itself, which then needs `tabIndex={-1}`), Tab and Shift+Tab cycle inside
 * it, and Escape calls `onClose`. When it closes, focus goes back to the
 * element that had it before.
 *
 * Escape is stopped from propagating, so the innermost overlay closes first.
 */
export function useOverlayFocus(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  onClose?: () => void,
): void {
  // Read through a ref so an inline `onClose` does not re-run the effect, whose
  // cleanup would hand focus back to the opener on every render.
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    const root = ref.current;
    if (!open || !root) return;
    const previous = document.activeElement as HTMLElement | null;
    if (!root.contains(previous)) (tabbable(root)[0] ?? root).focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (!close.current) return;
        event.stopPropagation();
        close.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = tabbable(root);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === root)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    root.addEventListener('keydown', onKeyDown);
    return () => {
      root.removeEventListener('keydown', onKeyDown);
      // Only pull focus back if it is still inside the overlay (or was dropped).
      const active = document.activeElement;
      if (previous?.isConnected && (!active || active === document.body || root.contains(active))) {
        previous.focus();
      }
    };
  }, [ref, open]);
}
