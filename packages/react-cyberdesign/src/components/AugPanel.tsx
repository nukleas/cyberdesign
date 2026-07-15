import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface AugPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Clip/padding size: `sm` (6px clip), `md` (default, 20px clip) or `lg` (32px clip). */
  size?: 'sm' | 'md' | 'lg';
  /** Clip all four corners instead of the default diagonal TL+BR pair. */
  corners4?: boolean;
  children?: ReactNode;
}

/** Augmented clip-path panel — neon drop-shadow border with clipped corners (cd-aug-panel). */
export function AugPanel({
  size = 'md',
  corners4 = false,
  className = '',
  children,
  ...rest
}: AugPanelProps) {
  return (
    <div
      className={cn(
        'cd-aug-panel',
        size === 'sm' && 'cd-aug-panel--sm',
        size === 'lg' && 'cd-aug-panel--lg',
        corners4 && 'cd-aug-panel--4',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
