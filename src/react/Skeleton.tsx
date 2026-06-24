import type { HTMLAttributes } from 'react';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Pre-sized shape. `block`/`card` render the compound containers; the rest are line/avatar/button placeholders. */
  shape?: 'plain' | 'text' | 'heading' | 'avatar' | 'btn' | 'block' | 'card';
  /** Fractional width helper (full / 3/4 / 1/2 / 1/3). Ignored for `block`/`card`. */
  width?: 'full' | '3/4' | '1/2' | '1/3';
}

/** Shimmering loading placeholder — text/heading/avatar/btn shapes plus block & card containers. */
export function Skeleton({
  shape = 'plain',
  width,
  className = '',
  children,
  ...rest
}: SkeletonProps) {
  if (shape === 'card' || shape === 'block') {
    return (
      <div className={cx(`cd-skeleton-${shape}`, className)} {...rest}>
        {children}
      </div>
    );
  }
  return (
    <div
      className={cx(
        'cd-skeleton',
        shape !== 'plain' && `cd-skeleton--${shape}`,
        width && `cd-skeleton--w-${width}`,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Inline row inside a `cd-skeleton-block` (e.g. avatar + text lines). */
export function SkeletonRow({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx('cd-skeleton-block__row', className)} {...rest}>
      {children}
    </div>
  );
}
