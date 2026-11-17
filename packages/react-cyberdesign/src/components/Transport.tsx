import { useEffect, useRef } from 'react';
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
 * Play/Stop transport cluster — AI-shell header transport group.
 *
 * Play and Stop are buttons (Tab, then Enter / Space). Pressing one disables it,
 * so focus moves to the other: the same key toggles playback back.
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
  const groupRef = useRef<HTMLDivElement>(null);
  // Set when the focused button is pressed: it is about to be disabled, which
  // would otherwise drop focus to the document.
  const handFocusOn = useRef(false);

  useEffect(() => {
    if (!handFocusOn.current) return;
    handFocusOn.current = false;
    groupRef.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus();
  }, [playing]);

  const press = (action?: () => void) => () => {
    handFocusOn.current = groupRef.current?.contains(document.activeElement) ?? false;
    action?.();
  };

  return (
    <div className={cn('cd-transport', className)} {...rest}>
      <div ref={groupRef} className="cd-transport__group" role="group" aria-label="Transport">
        <Button
          type="button"
          variant="primary"
          disabled={disabled || playing}
          onClick={press(onPlay)}
        >
          {playLabel}
        </Button>
        <Button
          type="button"
          variant="danger"
          disabled={disabled || !playing}
          onClick={press(onStop)}
        >
          {stopLabel}
        </Button>
      </div>
      {children}
    </div>
  );
}
