import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** `lg` renders the larger standalone key. */
  size?: 'md' | 'lg';
  /** Accent-highlighted key with a neon glow. */
  accent?: boolean;
  children?: ReactNode;
}

/** Keyboard key — boxed glyph with size and accent variants. */
export function Kbd({
  size = 'md',
  accent = false,
  className = '',
  children,
  ...rest
}: KbdProps) {
  return (
    <kbd
      className={cn(
        'cd-kbd',
        size === 'lg' && 'cd-kbd--lg',
        accent && 'cd-kbd--accent',
        className,
      )}
      {...rest}
    >
      {children}
    </kbd>
  );
}

export interface KbdGroupProps extends HTMLAttributes<HTMLSpanElement> {
  /** Separator rendered between keys (default `+`). */
  separator?: ReactNode;
  /** `Kbd` keys to combine. */
  children?: ReactNode;
}

/** Key combination group — joins multiple `Kbd` keys with a separator (e.g. ⌘ + K). */
export function KbdGroup({
  separator = '+',
  className = '',
  children,
  ...rest
}: KbdGroupProps) {
  const keys = Array.isArray(children) ? children : [children];
  return (
    <span className={cn('cd-kbd-group', className)} {...rest}>
      {keys.map((key, i) => (
        <span key={i} style={{ display: 'contents' }}>
          {i > 0 && <span className="cd-kbd-group__sep">{separator}</span>}
          {key}
        </span>
      ))}
    </span>
  );
}
