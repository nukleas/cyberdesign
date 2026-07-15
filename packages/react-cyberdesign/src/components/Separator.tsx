import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  /** Orientation. `vertical` draws a vertical divider. */
  orientation?: 'horizontal' | 'vertical';
  /** Neon gradient line instead of a plain rule. */
  neon?: boolean;
  /** Optional inline label (e.g. "OR"); centers it between the rules. */
  children?: ReactNode;
}

/** Divider rule — horizontal/vertical, optional neon gradient and centered label. */
export function Separator({
  orientation = 'horizontal',
  neon = false,
  className = '',
  children,
  ...rest
}: SeparatorProps) {
  const hasLabel = children != null;
  return (
    <div
      className={cn(
        'cd-separator',
        orientation === 'vertical' && 'cd-separator--vertical',
        neon && 'cd-separator--neon',
        hasLabel && 'cd-separator--label',
        !hasLabel && orientation === 'horizontal' && 'cd-separator--plain',
        className,
      )}
      role="separator"
      {...rest}
    >
      {children}
    </div>
  );
}
