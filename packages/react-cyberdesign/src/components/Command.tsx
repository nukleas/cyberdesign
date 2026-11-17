import { useId, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useActiveDescendant } from '../lib/activeDescendant';
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
  /** Accessible name of the search input and its list. @default 'Command palette' */
  'aria-label'?: string;
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
 *
 * Keyboard (WAI-ARIA combobox with a listbox): focus stays in the input, which
 * names the highlighted row through `aria-activedescendant`; rows are not Tab
 * stops. ArrowDown / ArrowUp move one row, PageDown / PageUp one screenful,
 * Home / End go to the first / last row, Enter runs the highlighted row.
 * Disabled rows are skipped. Pass `aria-label` to name the palette.
 */
export function Command({
  items,
  placeholder = 'Type a command…',
  emptyText = 'No results',
  onSelect,
  'aria-label': ariaLabel = 'Command palette',
  className = '',
  ...rest
}: CommandProps) {
  const [query, setQuery] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();

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
  const nav = useActiveDescendant(listRef, rows.length, (i) => rows[i].disabled === true);

  const run = (item: CommandItem) => {
    item.onSelect?.();
    onSelect?.(item);
  };

  let rowIdx = -1;

  return (
    <div className={cn('cd-command', className)} {...rest}>
      <div className="cd-command__input-wrap">
        <input
          className="cd-command__input"
          role="combobox"
          aria-label={ariaLabel}
          aria-expanded
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={nav.activeId}
          autoComplete="off"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            nav.setActive(0);
          }}
          onKeyDown={(e) => {
            if (nav.onKeyDown(e)) return;
            if (e.key === 'Enter' && nav.active >= 0) {
              e.preventDefault();
              run(rows[nav.active]);
            }
          }}
        />
      </div>
      <div
        ref={listRef}
        id={listId}
        className="cd-command__list"
        role="listbox"
        aria-label={ariaLabel}
        // Clicking a row must not take focus out of the input.
        onMouseDown={(e) => e.preventDefault()}
      >
        {rows.length === 0 && <div className="cd-command__empty">{emptyText}</div>}
        {groups.map(([group, groupItems], groupIdx) => {
          const options = groupItems.map((item) => {
            rowIdx += 1;
            const idx = rowIdx;
            const isActive = idx === nav.active;
            return (
              <div
                key={item.value}
                id={nav.optionId(idx)}
                role="option"
                aria-selected={isActive}
                aria-disabled={item.disabled || undefined}
                className={cn('cd-command__item', isActive && 'is-selected')}
                onMouseMove={() => {
                  if (!isActive && !item.disabled) nav.setActive(idx, false);
                }}
                onClick={() => {
                  if (!item.disabled) run(item);
                }}
              >
                {item.label}
                {item.kbd != null && <span className="cd-command__item-kbd">{item.kbd}</span>}
              </div>
            );
          });
          if (!group) return options;
          const labelId = `${listId}-group-${groupIdx}`;
          return (
            <div key={group} role="group" aria-labelledby={labelId}>
              <div id={labelId} className="cd-command__group-label">
                {group}
              </div>
              {options}
            </div>
          );
        })}
      </div>
    </div>
  );
}
