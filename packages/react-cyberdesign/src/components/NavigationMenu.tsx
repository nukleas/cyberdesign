import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface NavigationMenuLink {
  /** Link text. */
  label: ReactNode;
  /** Destination. Without it the item renders as a button. */
  href?: string;
  /** Marks the current page: `is-active` styling and `aria-current="page"`. */
  active?: boolean;
  /** Fired when the item is activated. */
  onClick?: () => void;
}

export interface NavigationMenuProps extends HTMLAttributes<HTMLElement> {
  /** The links, left to right. */
  items: NavigationMenuLink[];
}

/**
 * Horizontal navigation link row. Give it an `aria-label`.
 *
 * Keyboard: a `nav` landmark of plain links and buttons, not a `menu`, so each
 * one is an ordinary Tab stop activated with Enter (and Space for buttons).
 * There are no flyouts and so no arrow keys.
 */
export function NavigationMenu({ items, className = '', ...rest }: NavigationMenuProps) {
  return (
    <nav className={cn('cd-nav-menu', className)} {...rest}>
      {items.map((item, i) => {
        const cls = cn('cd-nav-menu__link', item.active && 'is-active');
        const current = item.active ? 'page' : undefined;
        if (item.href) {
          return (
            <a key={i} href={item.href} className={cls} aria-current={current} onClick={item.onClick}>
              {item.label}
            </a>
          );
        }
        return (
          <button key={i} type="button" className={cls} aria-current={current} onClick={item.onClick}>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

export type NavigationMenuItemProps = AnchorHTMLAttributes<HTMLAnchorElement>;
