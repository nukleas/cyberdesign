import { useCallback, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode, MouseEvent as ReactMouseEvent } from 'react';
import { cn } from '../lib/cn';

export interface ResizableProps extends HTMLAttributes<HTMLDivElement> {
  /** First panel content. */
  first: ReactNode;
  /** Second panel content. */
  second: ReactNode;
  /** Horizontal (side-by-side) or vertical (stacked). @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Initial first-panel size as percent 0–100. @default 50 */
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
}

/** Two-panel resizable split view. */
export function Resizable({
  first,
  second,
  orientation = 'horizontal',
  defaultSize = 50,
  minSize = 15,
  maxSize = 85,
  className = '',
  ...rest
}: ResizableProps) {
  const [size, setSize] = useState(defaultSize);
  const rootRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const onMove = useCallback(
    (clientX: number, clientY: number) => {
      const el = rootRef.current;
      if (!el || !dragging.current) return;
      const rect = el.getBoundingClientRect();
      const pct =
        orientation === 'horizontal'
          ? ((clientX - rect.left) / rect.width) * 100
          : ((clientY - rect.top) / rect.height) * 100;
      setSize(Math.min(maxSize, Math.max(minSize, pct)));
    },
    [orientation, minSize, maxSize],
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
      <div className="cd-resizable__panel" style={firstStyle}>
        {first}
      </div>
      <div
        className="cd-resizable__handle"
        role="separator"
        aria-orientation={orientation}
        onMouseDown={onMouseDown}
      />
      <div className="cd-resizable__panel" style={{ flex: 1 }}>
        {second}
      </div>
    </div>
  );
}
