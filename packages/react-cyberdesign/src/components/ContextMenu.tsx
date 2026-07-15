import { useEffect, useState } from 'react';
import type { HTMLAttributes, ReactNode, MouseEvent as ReactMouseEvent } from 'react';
import { cn } from '../lib/cn';

export interface ContextMenuItem {
  label: ReactNode;
  kbd?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
  sep?: boolean;
}

export interface ContextMenuProps extends HTMLAttributes<HTMLDivElement> {
  items: ContextMenuItem[];
  children: ReactNode;
}

/** Right-click context menu over children. */
export function ContextMenu({ items, children, className = '', ...rest }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('click', close);
    window.addEventListener('scroll', close, true);
    return () => {
      window.removeEventListener('click', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [open]);

  const onContextMenu = (e: ReactMouseEvent) => {
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
    setOpen(true);
  };

  return (
    <div className={cn(className)} onContextMenu={onContextMenu} {...rest}>
      {children}
      <div
        className={cn('cd-context-menu', open && 'is-open')}
        style={{ left: pos.x, top: pos.y }}
        role="menu"
      >
        {items.map((item, i) =>
          item.sep ? (
            <div key={i} className="cd-context-menu__sep" />
          ) : (
            <button
              key={i}
              type="button"
              role="menuitem"
              disabled={item.disabled}
              className={cn('cd-context-menu__item', item.danger && 'cd-context-menu__item--danger')}
              onClick={(e) => {
                e.stopPropagation();
                item.onSelect?.();
                setOpen(false);
              }}
            >
              {item.label}
              {item.kbd != null && <span className="cd-context-menu__kbd">{item.kbd}</span>}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
