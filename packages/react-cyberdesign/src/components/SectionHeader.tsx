import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface SectionHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Section title (uppercase tracking). */
  title: ReactNode;
  /** Leading caret glyph. @default '▸' */
  caret?: ReactNode;
  /** Right-aligned actions (chips, buttons, counts). */
  actions?: ReactNode;
  children?: ReactNode;
}

/**
 * Panel section title row — ocint pattern (`▸ INTEL FEED` / `▸ METRICS`).
 * Lighter than {@link PanelHeader}; use inside sidebars and column panels.
 */
export function SectionHeader({
  title,
  caret = '▸',
  actions,
  className = '',
  children,
  ...rest
}: SectionHeaderProps) {
  return (
    <div className={cn('cd-section-header', className)} {...rest}>
      {caret != null && <span className="cd-section-header__caret">{caret}</span>}
      <h2 className="cd-section-header__title">{title}</h2>
      {children}
      {actions != null && <div className="cd-section-header__actions">{actions}</div>}
    </div>
  );
}
