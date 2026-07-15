import type { HTMLAttributes, ReactNode } from 'react';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

export interface TickerProps extends HTMLAttributes<HTMLDivElement> {
  /** The feed items to scroll, in order. */
  items: ReactNode[];
  /** Scroll speed; `fast` ≈ 9s, `slow` ≈ 32s (default ≈ 18s). */
  speed?: 'fast' | 'slow';
  /** Shorthand for `speed="fast"`. */
  fast?: boolean;
  /** Scroll vertically instead of horizontally. */
  vertical?: boolean;
}

/** Auto-scrolling data ticker / feed — pauses on hover, respects reduced motion. */
export function Ticker({
  items,
  speed,
  fast = false,
  vertical = false,
  className = '',
  ...rest
}: TickerProps) {
  const resolvedSpeed = fast ? 'fast' : speed;
  return (
    <div
      className={cx(
        'cd-ticker',
        resolvedSpeed && `cd-ticker--${resolvedSpeed}`,
        vertical && 'cd-ticker--vertical',
        className,
      )}
      {...rest}
    >
      <div className="cd-ticker__inner">
        {items.map((item, i) => (
          <span key={i} className="cd-ticker__item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
