import type { CSSProperties, HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { cn } from '../lib/cn';
import type { CdColor } from '../lib/types';

export interface GlowCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  /** Neon border/glow color family. Defaults to `orange`. */
  color?: CdColor;
  /** Marks the card as selected (`data-active`). */
  active?: boolean;
  children?: ReactNode;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  style?: CSSProperties;
}

/** Interactive panel with neon border glow — primary surface for cyber layouts. */
export function GlowCard({
  color = 'orange',
  active,
  className,
  onClick,
  style,
  children,
  ...rest
}: GlowCardProps) {
  return (
    <div
      className={cn('cd-glow-card', `cd-glow-card--${color}`, className)}
      data-active={active ? 'true' : undefined}
      onClick={onClick}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}
