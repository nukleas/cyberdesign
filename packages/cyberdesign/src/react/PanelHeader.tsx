import type { HTMLAttributes, ReactNode } from 'react';

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

export interface PanelHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Trailing actions slot (right-aligned), e.g. a count or status indicator. */
  actions?: ReactNode;
  /** Header label / title content. */
  children?: ReactNode;
}

/** Panel header bar — uppercase neon title with an animated sweep and a right-aligned actions slot. */
export function PanelHeader({
  actions,
  className = '',
  children,
  ...rest
}: PanelHeaderProps) {
  return (
    <div className={cx('cd-panel-header', className)} {...rest}>
      {children}
      {actions != null && (
        <div className="cd-panel-header__actions">{actions}</div>
      )}
    </div>
  );
}
