import type { ReactNode } from 'react';
import { cn } from './cn';

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

/**
 * Renders menu entries for `Dropdown` and `ContextMenu`. `block` is the owning
 * CSS block; stateful parts use the shared `cd-menu-item__*` classes.
 */
export function MenuEntries({
  block,
  items,
  onClose,
}: {
  block: 'cd-dropdown' | 'cd-context-menu';
  items: MenuEntry[];
  /** Called after an item that closes the menu is selected. */
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
