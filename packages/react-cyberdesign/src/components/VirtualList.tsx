import { useCallback, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type {
  CSSProperties,
  HTMLAttributes,
  Key,
  KeyboardEvent,
  ReactNode,
  Ref,
  UIEvent,
} from 'react';
import { cn } from '../lib/cn';

/** Imperative handle exposed through {@link VirtualListProps.handleRef}. */
export interface VirtualListHandle {
  /**
   * Scroll the row at `index` into view by the shortest move: nothing happens if
   * it is already fully visible. Out-of-range indices are ignored.
   */
  scrollToIndex: (index: number) => void;
}

export interface VirtualListProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Every row's data, in order. Only the rows near the viewport are rendered. */
  items: readonly T[];
  /**
   * Row pitch in pixels. Every row is exactly this tall; content that is taller
   * is clipped.
   */
  rowHeight: number;
  /** Renders the content of one row. */
  renderRow: (item: T, index: number) => ReactNode;
  /** Stable key for a row. @default the row index */
  getRowKey?: (item: T, index: number) => Key;
  /** Rows rendered beyond each edge of the viewport. @default 6 */
  overscan?: number;
  /**
   * Extra attributes for a row's element: `role`, `aria-selected`, `className`,
   * handlers. Rows default to `role="listitem"` (`role="option"` in keyboard
   * mode) with `aria-setsize` and `aria-posinset` for the whole list; when you
   * change the list's `role`, give the rows the matching role here.
   */
  rowProps?: (item: T, index: number) => HTMLAttributes<HTMLDivElement>;
  /** Receives the imperative handle (`scrollToIndex`). */
  handleRef?: Ref<VirtualListHandle>;
  /**
   * Index of the active row; `-1` for none yet. Passing it turns on keyboard
   * mode: the list becomes a single Tab stop (`role="listbox"` unless `role`
   * says otherwise), Up / Down / Home / End / PageUp / PageDown ask to move the
   * active row through `onActiveIndexChange`, and the active row is kept in
   * view. Controlled: store the index you are given.
   */
  activeIndex?: number;
  /** Keyboard mode: a key or a click asks for a different active row. */
  onActiveIndexChange?: (index: number) => void;
  /** Keyboard mode: Enter or Space on the active row, or a click on a row. */
  onRowActivate?: (item: T, index: number) => void;
}

/**
 * Where a navigation key moves the active index in a list of `count` rows, or
 * `null` when `key` is not a navigation key. `page` is the number of rows
 * PageUp / PageDown move by. The index does not wrap.
 */
function moveActiveIndex(key: string, active: number, count: number, page: number): number | null {
  if (count === 0) return null;
  const last = count - 1;
  switch (key) {
    case 'ArrowDown':
      return Math.min(last, active + 1);
    case 'ArrowUp':
      return Math.max(0, active - 1);
    case 'PageDown':
      return Math.min(last, active + page);
    case 'PageUp':
      return Math.max(0, active - page);
    case 'Home':
      return 0;
    case 'End':
      return last;
    default:
      return null;
  }
}

/**
 * Fixed-row-height windowed list: thousands of items, a few dozen DOM nodes.
 *
 * The viewport needs a bounded height. It fills its container by default; set
 * `height` through `style` or `className` otherwise. An unbounded viewport
 * grows to its full length and renders every row.
 *
 * Pass `activeIndex` for a keyboard-driven list. DOM focus then stays on the
 * viewport and `aria-activedescendant` points at the active row, so focus
 * survives rows unmounting as the window moves.
 */
export function VirtualList<T>({
  items,
  rowHeight,
  renderRow,
  getRowKey,
  overscan = 6,
  rowProps,
  handleRef,
  activeIndex,
  onActiveIndexChange,
  onRowActivate,
  role,
  className = '',
  style,
  onScroll,
  onKeyDown,
  ...rest
}: VirtualListProps<T>) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const rowIdPrefix = useId();
  const count = items.length;
  const keyboard = activeIndex !== undefined;

  // Index of the row under the viewport's top edge, and the viewport's height.
  // Tracking the row rather than the pixel offset means scrolling re-renders
  // only when the window actually changes.
  const [topRow, setTopRow] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);

  const sync = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    setTopRow(Math.floor(viewport.scrollTop / rowHeight));
    setViewportHeight(viewport.clientHeight);
  }, [rowHeight]);

  // Measure before first paint, and again whenever the scroll height changes:
  // a shorter list makes the browser clamp scrollTop.
  useLayoutEffect(sync, [sync, count]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(sync);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [sync]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const viewport = viewportRef.current;
      if (!viewport || index < 0 || index >= count) return;
      const top = index * rowHeight;
      const bottom = top + rowHeight;
      if (top < viewport.scrollTop) viewport.scrollTop = top;
      else if (bottom > viewport.scrollTop + viewport.clientHeight) {
        viewport.scrollTop = bottom - viewport.clientHeight;
      }
    },
    [count, rowHeight],
  );

  useImperativeHandle(handleRef, () => ({ scrollToIndex }), [scrollToIndex]);

  // Keep the active row in view, and move the window with it before paint so
  // the row is mounted in the same frame its index becomes active.
  useLayoutEffect(() => {
    if (activeIndex === undefined) return;
    scrollToIndex(activeIndex);
    sync();
  }, [activeIndex, scrollToIndex, sync]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    sync();
    onScroll?.(event);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    // Keys pressed on a control inside a row belong to that control.
    if (activeIndex === undefined || event.defaultPrevented) return;
    if (event.target !== event.currentTarget) return;
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    if (event.key === 'Enter' || event.key === ' ') {
      if (activeIndex < 0 || activeIndex >= count) return;
      event.preventDefault();
      onRowActivate?.(items[activeIndex], activeIndex);
      return;
    }

    const page = Math.max(1, Math.floor(event.currentTarget.clientHeight / rowHeight));
    const next = moveActiveIndex(event.key, activeIndex, count, page);
    if (next === null) return;
    event.preventDefault();
    if (next !== activeIndex) onActiveIndexChange?.(next);
  };

  // Rows topRow .. topRow + ceil(height / pitch) cover the viewport wherever the
  // top row is cut (the top row may be partly scrolled off, hence one extra).
  const first = Math.max(0, topRow - overscan);
  const last = Math.min(count, topRow + Math.ceil(viewportHeight / rowHeight) + 1 + overscan);

  const rows: ReactNode[] = [];
  for (let index = first; index < last; index++) {
    const item = items[index];
    const { className: rowClassName, style: rowStyle, onClick, ...rowRest } = rowProps?.(item, index) ?? {};
    rows.push(
      <div
        key={getRowKey ? getRowKey(item, index) : index}
        role={keyboard ? 'option' : 'listitem'}
        aria-setsize={count}
        aria-posinset={index + 1}
        {...rowRest}
        {...(keyboard && { id: `${rowIdPrefix}-${index}` })}
        className={cn('cd-virtual-list__row', index === activeIndex && 'is-active', rowClassName)}
        style={{ ...rowStyle, ['--cd-virtual-list-index']: index } as CSSProperties}
        onClick={
          keyboard
            ? (event) => {
                onClick?.(event);
                if (index !== activeIndex) onActiveIndexChange?.(index);
                onRowActivate?.(item, index);
              }
            : onClick
        }
      >
        {renderRow(item, index)}
      </div>,
    );
  }

  return (
    <div
      ref={viewportRef}
      role={role ?? (keyboard ? 'listbox' : 'list')}
      className={cn('cd-virtual-list', keyboard && 'cd-virtual-list--interactive', className)}
      style={
        {
          ...style,
          ['--cd-virtual-list-row-height']: `${rowHeight}px`,
          ['--cd-virtual-list-count']: count,
        } as CSSProperties
      }
      onScroll={handleScroll}
      {...(keyboard && {
        tabIndex: 0,
        // Only while the active row is in the window: an id that is not in the
        // DOM must not be referenced.
        'aria-activedescendant':
          activeIndex >= first && activeIndex < last ? `${rowIdPrefix}-${activeIndex}` : undefined,
      })}
      onKeyDown={keyboard ? handleKeyDown : onKeyDown}
      {...rest}
    >
      <div className="cd-virtual-list__spacer" role="presentation">
        {rows}
      </div>
    </div>
  );
}
