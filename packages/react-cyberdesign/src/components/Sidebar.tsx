import { useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Button } from './Button';

export interface SidebarLink {
  label: ReactNode;
  icon?: ReactNode;
  href?: string;
  active?: boolean;
  onClick?: () => void;
}

export interface SidebarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  links: SidebarLink[];
  /** Main content beside the sidebar. */
  children?: ReactNode;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

/** App shell with collapsible sidebar navigation. */
export function Sidebar({
  title = 'Nav',
  links,
  children,
  defaultCollapsed = false,
  collapsed,
  onCollapsedChange,
  className = '',
  ...rest
}: SidebarProps) {
  const [internal, setInternal] = useState(defaultCollapsed);
  const isCollapsed = collapsed ?? internal;

  const toggle = () => {
    const next = !isCollapsed;
    if (collapsed == null) setInternal(next);
    onCollapsedChange?.(next);
  };

  return (
    <div className={cn('cd-sidebar-layout', className)} {...rest}>
      <aside className={cn('cd-sidebar', isCollapsed && 'cd-sidebar--collapsed')}>
        <div className="cd-sidebar__header">
          <span className="cd-sidebar__title">{title}</span>
          <Button type="button" size="sm" icon onClick={toggle} aria-label="Toggle sidebar">
            {isCollapsed ? '›' : '‹'}
          </Button>
        </div>
        <nav className="cd-sidebar__nav">
          {links.map((link, i) => {
            const cls = cn('cd-sidebar__link', link.active && 'is-active');
            const body = (
              <>
                {link.icon != null && <span className="cd-sidebar__link-icon">{link.icon}</span>}
                <span className="cd-sidebar__link-label">{link.label}</span>
              </>
            );
            if (link.href) {
              return (
                <a key={i} href={link.href} className={cls} onClick={link.onClick}>
                  {body}
                </a>
              );
            }
            return (
              <button key={i} type="button" className={cls} onClick={link.onClick}>
                {body}
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="cd-sidebar__main">{children}</main>
    </div>
  );
}
