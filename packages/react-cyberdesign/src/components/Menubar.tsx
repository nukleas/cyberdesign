import { useId, useRef, useState } from 'react';
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { cn } from '../lib/cn';
import { moveFocus } from '../lib/focus';
import { focusMenuItem, menuItems, moveMenuFocus, useMenuDismiss } from '../lib/menu';

export interface MenubarAction {
  /** Item label. */
  label: ReactNode;
  /** Disable selection; keyboard movement skips the item. */
  disabled?: boolean;
  /** Fired when the item is chosen. */
  onSelect?: () => void;
}

export interface MenubarMenu {
  /** Label of the top-level menu. */
  label: ReactNode;
  /** The menu's items. */
  items: MenubarAction[];
}

export interface MenubarProps extends HTMLAttributes<HTMLDivElement> {
  /** Top-level menus, left to right. */
  menus: MenubarMenu[];
}

/**
 * Horizontal application menubar with dropdown sections. Give it an `aria-label`.
 *
 * Keyboard (WAI-ARIA menubar): the bar is one Tab stop. ArrowLeft and
 * ArrowRight move between top-level menus, opening the neighbour if a menu is
 * open; Home, End and first-letter type-ahead also move along the bar.
 * ArrowDown, Enter or Space opens a menu on its first item and ArrowUp on its
 * last. In a menu, ArrowUp, ArrowDown, Home, End and type-ahead move between
 * enabled items; Enter or Space chooses one and returns focus to the bar;
 * Escape closes; Tab closes and moves on.
 */
export function Menubar({ menus, className = '', ...rest }: MenubarProps) {
  const [open, setOpen] = useState<number | null>(null);
  /** The top-level menu that is the bar's Tab stop. */
  const [current, setCurrent] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();

  const parts = (part: 'trigger' | 'menu') =>
    Array.from(root.current?.querySelectorAll<HTMLElement>(`.cd-menubar__${part}`) ?? []);

  const close = (restoreFocus: boolean) => {
    if (restoreFocus && open != null) parts('trigger')[open]?.focus();
    setOpen(null);
  };
  useMenuDismiss(open != null, root, close);

  const onTriggerKeyDown = (e: KeyboardEvent, i: number) => {
    const triggers = parts('trigger');
    const moved = moveMenuFocus(e, triggers, 'horizontal');
    if (moved) {
      // An open menu follows focus along the bar.
      if (open != null) setOpen(triggers.indexOf(moved));
      return;
    }
    // Enter and Space on an open menu fall through to the click, which closes it.
    const opens = e.key === 'ArrowDown' || (open !== i && (e.key === 'Enter' || e.key === ' '));
    if (!opens && e.key !== 'ArrowUp') return;
    e.preventDefault();
    // The menu has to be visible before one of its items can take focus.
    flushSync(() => setOpen(i));
    focusMenuItem(parts('menu')[i], opens ? 'first' : 'last');
  };

  const onMenuKeyDown = (e: KeyboardEvent<HTMLElement>, i: number) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      // Step along the bar from this menu's trigger and open the neighbour.
      const triggers = parts('trigger');
      triggers[i].focus();
      const moved = moveFocus(e, triggers, { orientation: 'horizontal' });
      if (moved) setOpen(triggers.indexOf(moved));
      return;
    }
    moveMenuFocus(e, menuItems(e.currentTarget));
  };

  const tabStop = Math.min(current, menus.length - 1);

  return (
    <div ref={root} className={cn('cd-menubar', className)} role="menubar" {...rest}>
      {menus.map((menu, i) => (
        <div
          key={i}
          role="none"
          className={cn('cd-menubar__item', open === i && 'is-open')}
          onMouseLeave={(e) => {
            if (open === i) close(e.currentTarget.contains(document.activeElement));
          }}
        >
          <button
            id={`${id}-trigger-${i}`}
            type="button"
            role="menuitem"
            className="cd-menubar__trigger"
            aria-haspopup="menu"
            aria-expanded={open === i}
            aria-controls={`${id}-menu-${i}`}
            tabIndex={i === tabStop ? 0 : -1}
            onFocus={() => setCurrent(i)}
            onClick={() => setOpen(open === i ? null : i)}
            onMouseEnter={() => open != null && setOpen(i)}
            onKeyDown={(e) => onTriggerKeyDown(e, i)}
          >
            {menu.label}
          </button>
          <div
            id={`${id}-menu-${i}`}
            className="cd-menubar__menu"
            role="menu"
            aria-labelledby={`${id}-trigger-${i}`}
            onKeyDown={(e) => onMenuKeyDown(e, i)}
          >
            {menu.items.map((item, j) => (
              <button
                key={j}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                tabIndex={-1}
                className="cd-menubar__action"
                onClick={() => {
                  item.onSelect?.();
                  close(true);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
