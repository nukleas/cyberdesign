import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface FeedItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> {
  /** Leading badge / category chip. */
  badge?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  time?: ReactNode;
  /** Selected row (map/feed selection). */
  selected?: boolean;
  children?: ReactNode;
}

/**
 * Intel-feed list row — dashboard-app feed cards with badge, title, meta, time.
 */
export function FeedItem({
  badge,
  title,
  subtitle,
  time,
  selected = false,
  className = '',
  children,
  type = 'button',
  ...rest
}: FeedItemProps) {
  return (
    <button
      type={type}
      className={cn('cd-feed-item', selected && 'is-selected', className)}
      data-active={selected || undefined}
      {...rest}
    >
      <div className="cd-feed-item__meta">
        {badge}
        {time != null && <span className="cd-feed-item__time">{time}</span>}
      </div>
      <div className="cd-feed-item__title">{title}</div>
      {subtitle != null && <div className="cd-feed-item__subtitle">{subtitle}</div>}
      {children}
    </button>
  );
}

export interface FeedProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export function Feed({ className = '', children, ...rest }: FeedProps) {
  return (
    <div className={cn('cd-feed', className)} {...rest}>
      {children}
    </div>
  );
}
