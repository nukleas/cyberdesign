import { useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode, MouseEvent as ReactMouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { cn } from '../lib/cn';
import { MenuEntries, focusMenuItem, menuItems, moveMenuFocus, useMenuDismiss } from '../lib/menu';
import type { MenuEntry } from '../lib/menu';

export interface ContextMenuProps extends HTMLAttributes<HTMLDivElement> {
  /** Menu entries: items, `{ sep: true }` separators, or `{ heading: true }` labels. */
  items: MenuEntry[];
  /**
   * Content that opens the menu on right-click, or on the Menu key / Shift+F10
   * while focus is inside it. For keyboard use something in it must be
   * focusable; pass `tabIndex={0}` to make the wrapper itself the target.
   */
  children: ReactNode;
}

/** Gap kept between the menu and the viewport edge, in px. */
const EDGE = 4;

/**
 * Context menu over children, opened by right-click or from the keyboard.
 *
 * Keyboard (WAI-ARIA menu): the Menu key or Shift+F10 opens the menu, anchored
 * to the focused element when the event carries no pointer position. Focus
 * moves to the first item; arrow keys, Home, End and first-letter type-ahead
 * move between enabled items; Enter or Space chooses one (a `switch` item
 * keeps the menu open); Escape closes; Tab closes and moves on. Closing
 * returns focus to the element that had it before the menu opened.
 */
export function ContextMenu({ items, children, className = '', ...rest }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  /** What had focus before the menu opened. */
  const previous = useRef<HTMLElement | null>(null);

  const close = (restoreFocus: boolean) => {
    setOpen(false);
    if (!restoreFocus) return;
    previous.current?.focus({ preventScroll: true });
    // Nothing focusable had focus before: do not leave it on a hidden item.
    const active = document.activeElement as HTMLElement | null;
    if (menuRef.current?.contains(active)) active?.blur();
  };
  useMenuDismiss(open, menuRef, close);

  // The menu is fixed to the viewport, so it would drift off its target on scroll.
  useEffect(() => {
    if (!open) return;
    const onScroll = () => close(true);
    window.addEventListener('scroll', onScroll, true);
    return () => window.removeEventListener('scroll', onScroll, true);
  });

  const onContextMenu = (e: ReactMouseEvent<HTMLDivElement>) => {
    const menu = menuRef.current;
    if (!menu) return;
    e.preventDefault();
    // A context-menu request on the open menu itself is not a request to move it.
    if (menu.contains(e.target as Node)) return;

    const active = document.activeElement as HTMLElement | null;
    previous.current = active;
    let { clientX: x, clientY: y } = e;
    if (x === 0 && y === 0) {
      // No pointer position (keyboard): hang the menu below the focused element.
      const anchor = active && e.currentTarget.contains(active) ? active : e.currentTarget;
      const rect = anchor.getBoundingClientRect();
      x = rect.left;
      y = rect.bottom;
    }
    // Keep the whole menu inside the viewport.
    const { clientWidth, clientHeight } = document.documentElement;
    x = Math.max(EDGE, Math.min(x, clientWidth - menu.offsetWidth - EDGE));
    y = Math.max(EDGE, Math.min(y, clientHeight - menu.offsetHeight - EDGE));

    // The menu has to be visible before one of its items can take focus.
    flushSync(() => {
      setPos({ x, y });
      setOpen(true);
    });
    focusMenuItem(menu, 'first');
  };

  return (
    <div className={cn(className)} onContextMenu={onContextMenu} {...rest}>
      {children}
      <div
        ref={menuRef}
        className={cn('cd-context-menu', open && 'is-open')}
        style={{ left: pos.x, top: pos.y }}
        role="menu"
        onKeyDown={(e) => moveMenuFocus(e, menuItems(e.currentTarget))}
      >
        <MenuEntries block="cd-context-menu" items={items} onClose={() => close(true)} />
      </div>
    </div>
  );
}
