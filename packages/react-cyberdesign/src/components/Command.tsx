import { useMemo, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface CommandItem {
  value: string;
  label: ReactNode;
  keywords?: string;
  group?: string;
  kbd?: ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface CommandProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  items: CommandItem[];
  placeholder?: string;
  emptyText?: string;
  onSelect?: (item: CommandItem) => void;
}

/** Filterable command palette list. */
export function Command({
  items,
  placeholder = 'Type a command…',
  emptyText = 'No results',
  onSelect,
  className = '',
  ...rest
}: CommandProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const hay = `${item.value} ${item.keywords ?? ''} ${typeof item.label === 'string' ? item.label : ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of filtered) {
      const g = item.group ?? '';
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(item);
    }
    return map;
  }, [filtered]);

  return (
    <div className={cn('cd-command', className)} {...rest}>
      <div className="cd-command__input-wrap">
        <input
          className="cd-command__input"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((i) => Math.min(i + 1, filtered.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (e.key === 'Enter' && filtered[active] && !filtered[active].disabled) {
              filtered[active].onSelect?.();
              onSelect?.(filtered[active]);
            }
          }}
        />
      </div>
      <div className="cd-command__list" role="listbox">
        {filtered.length === 0 && <div className="cd-command__empty">{emptyText}</div>}
        {Array.from(groups.entries()).map(([group, groupItems]) => (
          <div key={group || '__default'}>
            {group && <div className="cd-command__group-label">{group}</div>}
            {groupItems.map((item) => {
              const idx = filtered.indexOf(item);
              return (
                <button
                  key={item.value}
                  type="button"
                  role="option"
                  disabled={item.disabled}
                  className={cn('cd-command__item', idx === active && 'is-selected')}
                  data-selected={idx === active}
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => {
                    item.onSelect?.();
                    onSelect?.(item);
                  }}
                >
                  {item.label}
                  {item.kbd != null && <span className="cd-command__item-kbd">{item.kbd}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
