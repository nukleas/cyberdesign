import { ReactNode, MouseEvent } from 'react';

type GlowCardColor = 'orange' | 'amber' | 'gold' | 'cyan' | 'magenta' | 'green' | 'red' | 'blue' | 'purple';

interface GlowCardProps {
  children: ReactNode;
  color?: GlowCardColor;
  active?: boolean;
  /** Remove the card's padding, for full-bleed content that brings its own. */
  flush?: boolean;
  className?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
}

export function GlowCard({ color = 'orange', active, flush = false, className = '', onClick, style, children }: GlowCardProps) {
  return (
    <div
      className={`cd-glow-card cd-glow-card--${color}${flush ? ' cd-glow-card--flush' : ''}${className ? ` ${className}` : ''}`}
      data-active={active ? 'true' : undefined}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
}
