import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface EmptyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}

/** Empty state panel for lists, tables, and search results. */
export function Empty({
  icon = '⬡',
  title = 'No data',
  description,
  actions,
  className = '',
  children,
  ...rest
}: EmptyProps) {
  return (
    <div className={cn('cd-empty', className)} {...rest}>
      {icon != null && <div className="cd-empty__icon">{icon}</div>}
      {title != null && <h3 className="cd-empty__title">{title}</h3>}
      {description != null && <p className="cd-empty__description">{description}</p>}
      {children}
      {actions != null && <div className="cd-empty__actions">{actions}</div>}
    </div>
  );
}
