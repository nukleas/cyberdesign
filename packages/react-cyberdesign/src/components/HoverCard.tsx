import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface HoverCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Trigger content. */
  trigger: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}

/** Hover/focus-revealed card (CSS-driven). */
export function HoverCard({
  trigger,
  title,
  description,
  className = '',
  children,
  ...rest
}: HoverCardProps) {
  return (
    <div className={cn('cd-hover-card', className)} {...rest}>
      <span tabIndex={0}>{trigger}</span>
      <div className="cd-hover-card__content" role="tooltip">
        {title != null && <div className="cd-popover__title">{title}</div>}
        {description != null && <p className="cd-popover__description">{description}</p>}
        {children}
      </div>
    </div>
  );
}
