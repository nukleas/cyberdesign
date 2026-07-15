import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface NavigationMenuLink {
  label: ReactNode;
  href?: string;
  active?: boolean;
  onClick?: () => void;
}

export interface NavigationMenuProps extends HTMLAttributes<HTMLElement> {
  items: NavigationMenuLink[];
}

/** Horizontal navigation link row. */
export function NavigationMenu({ items, className = '', ...rest }: NavigationMenuProps) {
  return (
    <nav className={cn('cd-nav-menu', className)} {...rest}>
      {items.map((item, i) => {
        const cls = cn('cd-nav-menu__link', item.active && 'is-active');
        if (item.href) {
          return (
            <a key={i} href={item.href} className={cls} onClick={item.onClick}>
              {item.label}
            </a>
          );
        }
        return (
          <button key={i} type="button" className={cls} onClick={item.onClick}>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

export type NavigationMenuItemProps = AnchorHTMLAttributes<HTMLAnchorElement>;
