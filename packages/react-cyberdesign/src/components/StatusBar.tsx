import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface StatusBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Primary status message (gets `> ` prompt prefix). */
  message?: ReactNode;
  /** Show blinking terminal cursor after the message. @default true */
  cursor?: boolean;
  /** Leading status widget (e.g. StatusDot). */
  leading?: ReactNode;
  /** Trailing meta (filename, clock, etc.). */
  meta?: ReactNode;
  children?: ReactNode;
}

/**
 * App footer status strip — AI-shell status bar with terminal prompt/cursor.
 */
export function StatusBar({
  message,
  cursor = true,
  leading,
  meta,
  className = '',
  children,
  ...rest
}: StatusBarProps) {
  return (
    <div className={cn('cd-status-bar', className)} {...rest}>
      {leading}
      {message != null && (
        <span className={cn('cd-status-bar__message', cursor && 'cd-status-bar__message--cursor')}>
          {message}
        </span>
      )}
      {children}
      {meta != null && <div className="cd-status-bar__meta">{meta}</div>}
    </div>
  );
}
