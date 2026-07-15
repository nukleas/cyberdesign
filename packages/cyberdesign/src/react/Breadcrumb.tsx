import type { HTMLAttributes, ReactNode } from 'react';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

export interface BreadcrumbItem {
  /** Crumb text. */
  label: ReactNode;
  /** Link target. Omitted (or on the active crumb) renders plain text. */
  href?: string;
  /** Marks this crumb as the current page (plain, non-interactive). */
  active?: boolean;
}

export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Crumbs in order. The last item is treated as active if none is flagged. */
  items: BreadcrumbItem[];
  /** Separator style: `/` (default), `›` arrow, or `·` dot. */
  variant?: 'default' | 'arrow' | 'dot';
  /** Accessible label for the `<nav>`. */
  'aria-label'?: string;
}

/** Breadcrumb trail — data-driven crumbs with slash / arrow / dot separators; renders `<nav><ol>`. */
export function Breadcrumb({
  items,
  variant = 'default',
  className = '',
  'aria-label': ariaLabel = 'breadcrumb',
  ...rest
}: BreadcrumbProps) {
  const lastIndex = items.length - 1;
  return (
    <nav aria-label={ariaLabel} {...rest}>
      <ol
        className={cx(
          'cd-breadcrumb',
          variant === 'arrow' && 'cd-breadcrumb--arrow',
          variant === 'dot' && 'cd-breadcrumb--dot',
          className,
        )}
      >
        {items.map((item, i) => {
          const isActive = item.active ?? i === lastIndex;
          return (
            <li
              key={i}
              className={cx('cd-breadcrumb__item', isActive && 'cd-breadcrumb__item--active')}
            >
              {isActive || item.href == null ? (
                <span>{item.label}</span>
              ) : (
                <a className="cd-breadcrumb__link" href={item.href}>
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
