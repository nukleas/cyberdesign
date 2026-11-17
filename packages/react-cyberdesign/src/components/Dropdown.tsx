import { useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { MenuEntries } from '../lib/menu';
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
    <div className={cn('cd-dropdown', open && 'is-open', className)} {...rest}>
      <button
        type="button"
        className={cn(triggerClassName, 'cd-dropdown__trigger')}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {trigger}
      </button>
      <div
        className={cn('cd-dropdown__menu', align === 'right' && 'cd-dropdown__menu--right')}
        role="menu"
      >
        <MenuEntries block="cd-dropdown" items={items} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}
