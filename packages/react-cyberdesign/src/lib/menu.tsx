import { useEffect, useRef } from 'react';
import type { ReactNode, RefObject } from 'react';
import { cn } from './cn';
import { moveFocus } from './focus';
import type { MoveFocusOptions } from './focus';

export interface MenuItem {
  /** Item label text. */
  label: ReactNode;
  /**
   * What the item is. `action` (default) runs a command; `check` and `switch` are
   * independent toggles; `radio` is one of a group of adjacent radio items.
   * Selecting a `switch` item keeps the menu open; every other kind closes it.
   */
  kind?: 'action' | 'check' | 'radio' | 'switch';
  /** Current state of a `check`, `radio` or `switch` item. Controlled: flip it in `onSelect`. */
  checked?: boolean;
  /** Leading icon glyph. */
  icon?: ReactNode;
  /** Dim secondary text at the right (a current value, a count). */
  hint?: ReactNode;
  /** Right-aligned keyboard shortcut. */
  kbd?: ReactNode;
  /** Destructive styling (red on hover). */
  danger?: boolean;
  /** Disable selection. */
  disabled?: boolean;
  /** Fired when the item is chosen. */
  onSelect?: () => void;
}

/** A menu row: an item, a `{ sep: true }` separator, or a `{ heading: true }` section label. */
export type MenuEntry = MenuItem | { sep: true } | { label: ReactNode; heading: true };

const isMarked = (entry: MenuEntry) =>
  'kind' in entry && (entry.kind === 'check' || entry.kind === 'radio');

/** The enabled items of a menu, in display order. */
export function menuItems(menu: HTMLElement | null): HTMLElement[] {
  return Array.from(menu?.querySelectorAll<HTMLElement>('[role^="menuitem"]:not(:disabled)') ?? []);
}

/** Focus the first or last enabled item of a menu that is already visible. */
export function focusMenuItem(menu: HTMLElement | null, edge: 'first' | 'last'): void {
  menuItems(menu).at(edge === 'first' ? 0 : -1)?.focus();
}

const itemText = (item: HTMLElement) =>
  (item.querySelector('.cd-menu-item__label') ?? item).textContent?.trim().toLowerCase() ?? '';

/**
 * Keyboard movement inside a menu or along a menubar: arrow keys, Home and End
 * rove through `items` (looping), and a printable character jumps to the next
 * item whose label starts with it. Returns the item that received focus, after
 * calling `preventDefault`, or `null` when the key moved nothing.
 */
export function moveMenuFocus(
  event: { key: string; ctrlKey: boolean; metaKey: boolean; altKey: boolean; preventDefault: () => void },
  items: HTMLElement[],
  orientation: MoveFocusOptions['orientation'] = 'vertical',
): HTMLElement | null {
  const moved = moveFocus(event, items, { orientation });
  if (moved) return moved;
  if (event.key.length !== 1 || event.key === ' ' || event.ctrlKey || event.metaKey || event.altKey) {
    return null;
  }
  // Search from the item after the focused one, wrapping round to it.
  const start = items.indexOf(document.activeElement as HTMLElement) + 1;
  const match = [...items.slice(start), ...items.slice(0, start)].find((item) =>
    itemText(item).startsWith(event.key.toLowerCase()),
  );
  if (!match) return null;
  event.preventDefault();
  match.focus();
  return match;
}

/**
 * Dismissal for an open menu. A press outside `root` closes it; Escape closes
 * it; Tab from inside `root` closes it and lets the browser move on. `close`
 * is told whether to hand focus back to whatever opened the menu: for Tab it
 * must do so synchronously, so the browser tabs on from there.
 *
 * The key listener is on `window` in the capture phase and Escape is stopped
 * there, so a menu inside a dialog closes before the dialog does.
 */
export function useMenuDismiss(
  open: boolean,
  root: RefObject<HTMLElement | null>,
  close: (restoreFocus: boolean) => void,
): void {
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    if (!open) return;
    const inside = (node: EventTarget | null) => root.current?.contains(node as Node) ?? false;
    const onPointerDown = (event: PointerEvent) => {
      if (!inside(event.target)) closeRef.current(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        closeRef.current(inside(document.activeElement));
      } else if (event.key === 'Tab' && inside(document.activeElement)) {
        closeRef.current(true);
      }
    };
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, [open, root]);
}

/**
 * Renders menu entries for `Dropdown` and `ContextMenu`. `block` is the owning
 * CSS block; stateful parts use the shared `cd-menu-item__*` classes. Items are
 * not Tab stops: the owning menu moves focus among them with `moveMenuFocus`.
 */
export function MenuEntries({
  block,
  items,
  onClose,
}: {
  block: 'cd-dropdown' | 'cd-context-menu';
  items: MenuEntry[];
  /** Called after an item that closes the menu is selected (every kind but `switch`). */
  onClose: () => void;
}) {
  // One check or radio item gives every item a gutter, so labels stay aligned.
  const gutter = items.some(isMarked);

  return (
    <>
      {items.map((entry, i) => {
        if ('sep' in entry) {
          return <div key={i} className={`${block}__sep`} role="separator" />;
        }
        if ('heading' in entry) {
          return (
            <div key={i} className={`${block}__label`}>
              {entry.label}
            </div>
          );
        }
        const { kind = 'action' } = entry;
        return (
          <button
            key={i}
            type="button"
            role={
              kind === 'action' ? 'menuitem' : kind === 'radio' ? 'menuitemradio' : 'menuitemcheckbox'
            }
            aria-checked={kind === 'action' ? undefined : entry.checked === true}
            className={cn(`${block}__item`, entry.danger && `${block}__item--danger`)}
            disabled={entry.disabled}
            tabIndex={-1}
            onClick={() => {
              entry.onSelect?.();
              if (kind !== 'switch') onClose();
            }}
          >
            {gutter && (
              <span
                className={cn(
                  'cd-menu-item__gutter',
                  kind === 'check' && 'cd-menu-item__gutter--check',
                  kind === 'radio' && 'cd-menu-item__gutter--radio',
                )}
              />
            )}
            {entry.icon != null && <span className={`${block}__item-icon`}>{entry.icon}</span>}
            <span className="cd-menu-item__label">{entry.label}</span>
            {entry.hint != null && <span className="cd-menu-item__hint">{entry.hint}</span>}
            {entry.kbd != null && <span className={`${block}__item-kbd`}>{entry.kbd}</span>}
            {kind === 'switch' && <span className="cd-menu-item__switch" />}
          </button>
        );
      })}
    </>
  );
}
