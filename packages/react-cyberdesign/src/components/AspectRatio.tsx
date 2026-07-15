import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /** Aspect ratio as width/height (e.g. 16/9). @default 16/9 */
  ratio?: number;
  children?: ReactNode;
}

/** Locks children to a fixed aspect ratio box. */
export function AspectRatio({
  ratio = 16 / 9,
  className = '',
  style,
  children,
  ...rest
}: AspectRatioProps) {
  const merged: CSSProperties = {
    ...style,
    paddingBottom: `${(1 / ratio) * 100}%`,
  };
  return (
    <div className={cn('cd-aspect-ratio', className)} style={merged} {...rest}>
      {children}
    </div>
  );
}
