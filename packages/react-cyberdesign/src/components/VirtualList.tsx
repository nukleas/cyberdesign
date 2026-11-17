import { useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, HTMLAttributes, Key, ReactNode, Ref, UIEvent } from 'react';
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
   * handlers. Rows default to `role="listitem"` with `aria-setsize` and
   * `aria-posinset` for the whole list; when you change the list's `role`, give
   * the rows the matching role here.
   */
  rowProps?: (item: T, index: number) => HTMLAttributes<HTMLDivElement>;
  /** Receives the imperative handle (`scrollToIndex`). */
  handleRef?: Ref<VirtualListHandle>;
}

/**
 * Fixed-row-height windowed list: thousands of items, a few dozen DOM nodes.
 *
 * The viewport needs a bounded height. It fills its container by default; set
 * `height` through `style` or `className` otherwise. An unbounded viewport
 * grows to its full length and renders every row.
 */
export function VirtualList<T>({
  items,
  rowHeight,
  renderRow,
  getRowKey,
  overscan = 6,
  rowProps,
  handleRef,
  role = 'list',
  className = '',
  style,
  onScroll,
  ...rest
}: VirtualListProps<T>) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const count = items.length;

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

  useImperativeHandle(
    handleRef,
    () => ({
      scrollToIndex(index) {
        const viewport = viewportRef.current;
        if (!viewport || index < 0 || index >= count) return;
        const top = index * rowHeight;
        const bottom = top + rowHeight;
        if (top < viewport.scrollTop) viewport.scrollTop = top;
        else if (bottom > viewport.scrollTop + viewport.clientHeight) {
          viewport.scrollTop = bottom - viewport.clientHeight;
        }
      },
    }),
    [count, rowHeight],
  );

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    sync();
    onScroll?.(event);
  };

  // Rows topRow .. topRow + ceil(height / pitch) cover the viewport wherever the
  // top row is cut (the top row may be partly scrolled off, hence one extra).
  const first = Math.max(0, topRow - overscan);
  const last = Math.min(count, topRow + Math.ceil(viewportHeight / rowHeight) + 1 + overscan);

  const rows: ReactNode[] = [];
  for (let index = first; index < last; index++) {
    const item = items[index];
    const { className: rowClassName, style: rowStyle, ...rowRest } = rowProps?.(item, index) ?? {};
    rows.push(
      <div
        key={getRowKey ? getRowKey(item, index) : index}
        role="listitem"
        aria-setsize={count}
        aria-posinset={index + 1}
        {...rowRest}
        className={cn('cd-virtual-list__row', rowClassName)}
        style={{ ...rowStyle, ['--cd-virtual-list-index']: index } as CSSProperties}
      >
        {renderRow(item, index)}
      </div>,
    );
  }

  return (
    <div
      ref={viewportRef}
      role={role}
      className={cn('cd-virtual-list', className)}
      style={
        {
          ...style,
          ['--cd-virtual-list-row-height']: `${rowHeight}px`,
          ['--cd-virtual-list-count']: count,
        } as CSSProperties
      }
      onScroll={handleScroll}
      {...rest}
    >
      <div className="cd-virtual-list__spacer" role="presentation">
        {rows}
      </div>
    </div>
  );
}
