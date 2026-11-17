import type { CSSProperties, HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { pressOnKey } from '../lib/pressable';
import type { CdColor } from '../lib/types';

export interface GlowCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  /** Neon border/glow color family. Defaults to `orange`. */
  color?: CdColor;
  /** Marks the card as selected (`data-active`, and `aria-pressed` on a clickable card). */
  active?: boolean;
  children?: ReactNode;
  /**
   * Makes the whole card one control: it gets `role="button"`, a Tab stop, and
   * Enter / Space fire this handler. Do not put other controls inside a
   * clickable card.
   */
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  style?: CSSProperties;
}

/** Panel with neon border glow — primary surface for cyber layouts, and a button when given `onClick`. */
export function GlowCard({
  color = 'orange',
  active,
  className,
  onClick,
  onKeyDown,
  style,
  children,
  ...rest
}: GlowCardProps) {
  return (
    <div
      className={cn('cd-glow-card', `cd-glow-card--${color}`, className)}
      data-active={active ? 'true' : undefined}
      onClick={onClick}
      {...(onClick && { role: 'button', tabIndex: 0, 'aria-pressed': active })}
      onKeyDown={
        onClick
          ? (event) => {
              onKeyDown?.(event);
              if (!event.defaultPrevented) pressOnKey(event);
            }
          : onKeyDown
      }
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}
