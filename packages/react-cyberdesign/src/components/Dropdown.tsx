import { useId, useRef, useState } from 'react';
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { flushSync } from 'react-dom';
import { cn } from '../lib/cn';
import { MenuEntries, focusMenuItem, menuItems, moveMenuFocus, useMenuDismiss } from '../lib/menu';
import type { MenuEntry } from '../lib/menu';

export interface DropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Trigger node — rendered as the `cd-dropdown__trigger` button content. */
  trigger: ReactNode;
  /** Menu entries: items, `{ sep: true }` separators, or `{ heading: true }` labels. */
  items: MenuEntry[];
  /** Right-align the menu panel under the trigger. */
  align?: 'left' | 'right';
  /** Extra classes for the trigger button (e.g. `cd-btn cd-btn--primary`). */
  triggerClassName?: string;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
}

/**
 * Dropdown menu — a trigger button toggling a `cd-dropdown__menu` of data-driven items.
 *
 * Keyboard (WAI-ARIA menu button): on the trigger, ArrowDown, Enter or Space
 * opens the menu on its first item and ArrowUp on its last. In the menu, arrow
 * keys, Home, End and first-letter type-ahead move between enabled items;
 * Enter or Space chooses one and returns focus to the trigger (a `switch` item
 * keeps the menu open); Escape closes; Tab closes and moves on.
 */
export function Dropdown({
  trigger,
  items,
  align = 'left',
  triggerClassName = 'cd-btn',
  defaultOpen = false,
  className = '',
  ...rest
}: DropdownProps) {
  const [open, setOpen] = useState(defaultOpen);
  const root = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const close = (restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };
  useMenuDismiss(open, root, close);

  const onTriggerKeyDown = (e: KeyboardEvent) => {
    // Enter and Space on an open menu fall through to the click, which closes it.
    const opens = e.key === 'ArrowDown' || (!open && (e.key === 'Enter' || e.key === ' '));
    if (!opens && e.key !== 'ArrowUp') return;
    e.preventDefault();
    // The menu has to be visible before one of its items can take focus.
    flushSync(() => setOpen(true));
    focusMenuItem(menuRef.current, opens ? 'first' : 'last');
  };

  return (
    <div ref={root} className={cn('cd-dropdown', open && 'is-open', className)} {...rest}>
      <button
        ref={triggerRef}
        id={`${id}-trigger`}
        type="button"
        className={cn(triggerClassName, 'cd-dropdown__trigger')}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={`${id}-menu`}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKeyDown}
      >
        {trigger}
      </button>
      <div
        ref={menuRef}
        id={`${id}-menu`}
        className={cn('cd-dropdown__menu', align === 'right' && 'cd-dropdown__menu--right')}
        role="menu"
        aria-labelledby={`${id}-trigger`}
        onKeyDown={(e) => moveMenuFocus(e, menuItems(e.currentTarget))}
      >
        <MenuEntries block="cd-dropdown" items={items} onClose={() => close(true)} />
      </div>
    </div>
  );
}
