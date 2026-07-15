import { useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

export interface DropdownItem {
  /** Item label text. */
  label: ReactNode;
  /** Leading icon glyph rendered in the `__item-icon` slot. */
  icon?: ReactNode;
  /** Right-aligned keyboard shortcut hint (`__item-kbd`). */
  kbd?: ReactNode;
  /** Destructive styling (red on hover). */
  danger?: boolean;
  /** Disable selection. */
  disabled?: boolean;
  /** Fired when the item is clicked (closes the menu). */
  onSelect?: () => void;
}

export type DropdownEntry =
  | DropdownItem
  | { sep: true }
  | { label: ReactNode; heading: true };

export interface DropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Trigger node — rendered as the `cd-dropdown__trigger` button content. */
  trigger: ReactNode;
  /** Menu entries: items, `{ sep: true }` separators, or `{ heading: true }` labels. */
  items: DropdownEntry[];
  /** Right-align the menu panel under the trigger. */
  align?: 'left' | 'right';
  /** Extra classes for the trigger button (e.g. `cd-btn cd-btn--primary`). */
  triggerClassName?: string;
  /** Initial open state (uncontrolled). */
  defaultOpen?: boolean;
}

/** Dropdown menu — a trigger button toggling a `cd-dropdown__menu` of data-driven items. */
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

  return (
    <div className={cx('cd-dropdown', open && 'is-open', className)} {...rest}>
      <button
        type="button"
        className={cx(triggerClassName, 'cd-dropdown__trigger')}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {trigger}
      </button>
      <div
        className={cx('cd-dropdown__menu', align === 'right' && 'cd-dropdown__menu--right')}
        role="menu"
      >
        {items.map((entry, i) => {
          if ('sep' in entry && entry.sep) {
            return <div key={i} className="cd-dropdown__sep" />;
          }
          if ('heading' in entry && entry.heading) {
            return (
              <div key={i} className="cd-dropdown__label">
                {entry.label}
              </div>
            );
          }
          const item = entry as DropdownItem;
          return (
            <button
              key={i}
              type="button"
              role="menuitem"
              className={cx('cd-dropdown__item', item.danger && 'cd-dropdown__item--danger')}
              disabled={item.disabled}
              aria-disabled={item.disabled || undefined}
              onClick={() => {
                item.onSelect?.();
                setOpen(false);
              }}
            >
              {item.icon != null && (
                <span className="cd-dropdown__item-icon">{item.icon}</span>
              )}
              {item.label}
              {item.kbd != null && (
                <span className="cd-dropdown__item-kbd">{item.kbd}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
