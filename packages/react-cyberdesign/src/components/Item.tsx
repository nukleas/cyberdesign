import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface ItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  media?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  bordered?: boolean;
  interactive?: boolean;
  children?: ReactNode;
}

/** List row primitive — media, title, description, actions. */
export function Item({
  media,
  title,
  description,
  actions,
  bordered = false,
  interactive = false,
  className = '',
  children,
  ...rest
}: ItemProps) {
  return (
    <div
      className={cn(
        'cd-item',
        bordered && 'cd-item--bordered',
        interactive && 'cd-item--interactive',
        className,
      )}
      {...rest}
    >
      {media != null && <div className="cd-item__media">{media}</div>}
      <div className="cd-item__content">
        {title != null && <div className="cd-item__title">{title}</div>}
        {description != null && <div className="cd-item__description">{description}</div>}
        {children}
      </div>
      {actions != null && <div className="cd-item__actions">{actions}</div>}
    </div>
  );
}

export function ItemGroup({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('cd-item-group', className)} {...rest}>
      {children}
    </div>
  );
}
