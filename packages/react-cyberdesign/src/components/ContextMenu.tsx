import { useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode, MouseEvent as ReactMouseEvent } from 'react';
import { cn } from '../lib/cn';
import { MenuEntries } from '../lib/menu';
import type { MenuEntry } from '../lib/menu';

export interface ContextMenuProps extends HTMLAttributes<HTMLDivElement> {
  /** Menu entries: items, `{ sep: true }` separators, or `{ heading: true }` labels. */
  items: MenuEntry[];
  /** Content that opens the menu on right-click. */
  children: ReactNode;
}

/** Right-click context menu over children. */
export function ContextMenu({ items, children, className = '', ...rest }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    // Clicks inside the menu are the items' business: a switch item keeps it open.
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) close();
    };
    window.addEventListener('click', onClick);
    window.addEventListener('scroll', close, true);
    return () => {
      window.removeEventListener('click', onClick);
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
        ref={menuRef}
        className={cn('cd-context-menu', open && 'is-open')}
        style={{ left: pos.x, top: pos.y }}
        role="menu"
      >
        <MenuEntries block="cd-context-menu" items={items} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
}
