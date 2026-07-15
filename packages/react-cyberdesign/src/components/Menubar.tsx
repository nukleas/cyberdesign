import { useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface MenubarAction {
  label: ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface MenubarMenu {
  label: ReactNode;
  items: MenubarAction[];
}

export interface MenubarProps extends HTMLAttributes<HTMLDivElement> {
  menus: MenubarMenu[];
}

/** Horizontal application menubar with dropdown sections. */
export function Menubar({ menus, className = '', ...rest }: MenubarProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className={cn('cd-menubar', className)} role="menubar" {...rest}>
      {menus.map((menu, i) => (
        <div
          key={i}
          className={cn('cd-menubar__item', open === i && 'is-open')}
          onMouseLeave={() => setOpen(null)}
        >
          <button
            type="button"
            className="cd-menubar__trigger"
            onClick={() => setOpen(open === i ? null : i)}
            onMouseEnter={() => open != null && setOpen(i)}
          >
            {menu.label}
          </button>
          <div className="cd-menubar__menu" role="menu">
            {menu.items.map((item, j) => (
              <button
                key={j}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                className="cd-menubar__action"
                onClick={() => {
                  item.onSelect?.();
                  setOpen(null);
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
