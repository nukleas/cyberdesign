import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface BottomNavItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  disabled?: boolean;
}

export interface BottomNavProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  items: BottomNavItem[];
  /** Active item id. */
  value?: string;
  onValueChange?: (id: string) => void;
}

/**
 * Mobile bottom tab bar — dashboard-app MAP / FEED / STATS / TIME pattern.
 */
export function BottomNav({
  items,
  value,
  onValueChange,
  className = '',
  ...rest
}: BottomNavProps) {
  return (
    <nav className={cn('cd-bottom-nav', className)} {...rest}>
      {items.map((item) => {
        const active = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            disabled={item.disabled}
            className={cn('cd-bottom-nav__item', active && 'is-active')}
            data-active={active || undefined}
            onClick={() => onValueChange?.(item.id)}
          >
            {item.icon != null && <span className="cd-bottom-nav__icon">{item.icon}</span>}
            <span className="cd-bottom-nav__label">{item.label}</span>
            {item.badge != null && (
              <span className="cd-bottom-nav__badge">{item.badge}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
