import { useEffect, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { fuzzyRank } from '../lib/fuzzy';

export interface CommandItem {
  /** Unique id. Also searchable: the primary text when `label` is not a string, a secondary field otherwise. */
  value: string;
  /** Row content. A string label is the primary text the query is matched against. */
  label: ReactNode;
  /** Extra search terms — a weaker, secondary field (substring match only). */
  keywords?: string;
  /** Heading the item is listed under. */
  group?: string;
  /** Shortcut hint shown at the end of the row. */
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

const primaryText = (item: CommandItem) =>
  typeof item.label === 'string' ? item.label : item.value;

const secondaryText = (item: CommandItem) =>
  typeof item.label === 'string' ? `${item.keywords ?? ''} ${item.value}` : (item.keywords ?? '');

/**
 * Command palette list with ranked fuzzy matching (`fuzzyRank`).
 *
 * With a query, items are filtered to matches and ordered best first: exact,
 * prefix, substring, `keywords` / `value` match, then subsequence ("sf" finds
 * "Save File"). Groups keep their headings and are ordered by their best match,
 * so the first row is always the best match overall — it is highlighted and
 * Enter runs it. With an empty query the original order is kept.
 */
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
  const listRef = useRef<HTMLDivElement>(null);

  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of fuzzyRank(items, query, primaryText, secondaryText)) {
      const g = item.group ?? '';
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(item);
    }
    return Array.from(map.entries());
  }, [items, query]);

  // Rows in display order — keyboard navigation walks exactly what is rendered.
  const rows = useMemo(() => groups.flatMap(([, groupItems]) => groupItems), [groups]);
  const activeIdx = Math.max(0, Math.min(active, rows.length - 1));

  // Keep the highlighted row inside the scrolling list.
  useEffect(() => {
    const list = listRef.current;
    const row = list?.querySelector('.is-selected');
    if (!list || !row) return;
    if (activeIdx === 0) {
      list.scrollTop = 0;
      return;
    }
    const l = list.getBoundingClientRect();
    const r = row.getBoundingClientRect();
    if (r.top < l.top) list.scrollTop -= l.top - r.top;
    else if (r.bottom > l.bottom) list.scrollTop += r.bottom - l.bottom;
  }, [activeIdx, query]);

  let rowIdx = -1;

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
              setActive(Math.min(activeIdx + 1, rows.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive(Math.max(activeIdx - 1, 0));
            } else if (e.key === 'Enter' && rows[activeIdx] && !rows[activeIdx].disabled) {
              rows[activeIdx].onSelect?.();
              onSelect?.(rows[activeIdx]);
            }
          }}
        />
      </div>
      <div ref={listRef} className="cd-command__list" role="listbox">
        {rows.length === 0 && <div className="cd-command__empty">{emptyText}</div>}
        {groups.map(([group, groupItems]) => (
          <div key={group || '__default'}>
            {group && <div className="cd-command__group-label">{group}</div>}
            {groupItems.map((item) => {
              rowIdx += 1;
              const idx = rowIdx;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="option"
                  aria-selected={idx === activeIdx}
                  disabled={item.disabled}
                  className={cn('cd-command__item', idx === activeIdx && 'is-selected')}
                  data-selected={idx === activeIdx}
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
