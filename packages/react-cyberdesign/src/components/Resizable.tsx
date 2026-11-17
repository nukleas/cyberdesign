import { useCallback, useId, useRef, useState } from 'react';
import type {
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import { useScrollTabStop } from '../lib/useScrollTabStop';

/** Percent moved by an arrow key, and by Shift + arrow. */
const STEP = 2;
const LARGE_STEP = 10;

export interface ResizableProps extends HTMLAttributes<HTMLDivElement> {
  /** First panel content. */
  first: ReactNode;
  /** Second panel content. */
  second: ReactNode;
  /** Horizontal (side-by-side) or vertical (stacked). @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Initial first-panel size as percent 0–100. @default 50 */
  defaultSize?: number;
  /** Smallest first-panel size, in percent. @default 15 */
  minSize?: number;
  /** Largest first-panel size, in percent. @default 85 */
  maxSize?: number;
  /** Accessible name of the divider. @default 'Resize panels' */
  handleLabel?: string;
}

/**
 * Two-panel resizable split view.
 *
 * The divider is a focusable window splitter (`role="separator"` with the first
 * panel's size as its value): the arrow keys along the split axis move it by
 * 2%, Shift + arrow by 10%, Home and End go to `minSize` and `maxSize`.
 */
export function Resizable({
  first,
  second,
  orientation = 'horizontal',
  defaultSize = 50,
  minSize = 15,
  maxSize = 85,
  handleLabel = 'Resize panels',
  className = '',
  ...rest
}: ResizableProps) {
  const [size, setSize] = useState(defaultSize);
  const rootRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);
  const firstTabStop = useScrollTabStop(firstRef);
  const secondTabStop = useScrollTabStop(secondRef);
  const firstId = useId();
  const dragging = useRef(false);

  const resize = useCallback(
    (next: number) => setSize(Math.min(maxSize, Math.max(minSize, next))),
    [minSize, maxSize],
  );

  const onMove = useCallback(
    (clientX: number, clientY: number) => {
      const el = rootRef.current;
      if (!el || !dragging.current) return;
      const rect = el.getBoundingClientRect();
      resize(
        orientation === 'horizontal'
          ? ((clientX - rect.left) / rect.width) * 100
          : ((clientY - rect.top) / rect.height) * 100,
      );
    },
    [orientation, resize],
  );

  const onMouseDown = (e: ReactMouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    const move = (ev: MouseEvent) => onMove(ev.clientX, ev.clientY);
    const up = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  const onKeyDown = (e: ReactKeyboardEvent) => {
    const step = e.shiftKey ? LARGE_STEP : STEP;
    const [shrink, grow] =
      orientation === 'horizontal' ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];
    let next: number;
    if (e.key === shrink) next = size - step;
    else if (e.key === grow) next = size + step;
    else if (e.key === 'Home') next = minSize;
    else if (e.key === 'End') next = maxSize;
    else return;
    e.preventDefault();
    resize(next);
  };

  const firstStyle =
    orientation === 'horizontal'
      ? { width: `${size}%`, flex: 'none' as const }
      : { height: `${size}%`, flex: 'none' as const };

  return (
    <div
      ref={rootRef}
      className={cn(
        'cd-resizable',
        orientation === 'vertical' && 'cd-resizable--vertical',
        className,
      )}
      {...rest}
    >
      <div
        ref={firstRef}
        id={firstId}
        className="cd-resizable__panel"
        style={firstStyle}
        {...(firstTabStop && { tabIndex: 0, role: 'group' })}
      >
        {first}
      </div>
      <div
        className="cd-resizable__handle"
        role="separator"
        tabIndex={0}
        aria-label={handleLabel}
        aria-controls={firstId}
        // A separator's orientation is that of its own line, across the split.
        aria-orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'}
        aria-valuenow={Math.round(size)}
        aria-valuemin={minSize}
        aria-valuemax={maxSize}
        onMouseDown={onMouseDown}
        onKeyDown={onKeyDown}
      />
      <div
        ref={secondRef}
        className="cd-resizable__panel"
        style={{ flex: 1 }}
        {...(secondTabStop && { tabIndex: 0, role: 'group' })}
      >
        {second}
      </div>
    </div>
  );
}
