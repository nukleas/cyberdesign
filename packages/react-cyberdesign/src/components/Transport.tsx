import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Button } from './Button';

export interface TransportProps extends HTMLAttributes<HTMLDivElement> {
  playing?: boolean;
  onPlay?: () => void;
  onStop?: () => void;
  playLabel?: ReactNode;
  stopLabel?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
}

/**
 * Play/Stop transport cluster — robostrudel header transport group.
 */
export function Transport({
  playing = false,
  onPlay,
  onStop,
  playLabel = '▶ Play',
  stopLabel = '■ Stop',
  disabled = false,
  className = '',
  children,
  ...rest
}: TransportProps) {
  return (
    <div className={cn('cd-transport', className)} {...rest}>
      <div className="cd-transport__group">
        <Button
          type="button"
          variant="primary"
          disabled={disabled || playing}
          onClick={onPlay}
        >
          {playLabel}
        </Button>
        <Button
          type="button"
          variant="danger"
          disabled={disabled || !playing}
          onClick={onStop}
        >
          {stopLabel}
        </Button>
      </div>
      {children}
    </div>
  );
}
