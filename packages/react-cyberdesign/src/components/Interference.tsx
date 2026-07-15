import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface InterferenceProps extends HTMLAttributes<HTMLDivElement> {
  /** Static intensity: `light`, default, or `heavy`. */
  intensity?: 'light' | 'heavy';
  /** Extra-aggressive noise (combine with `heavy`). */
  intense?: boolean;
  /** Enable the text/data corruption effect (uses `corruptText` as the clipped layer text). */
  glitch?: boolean;
  /**
   * Text driving the glitch corruption layers (sets `data-text` on the content wrapper).
   * Required for the corruption effect to render; should match the visible heading text.
   */
  corruptText?: string;
  /** Content shown beneath the noise overlay. */
  children?: ReactNode;
}

/** Animated static / data-corruption overlay — adds a `__noise` layer over wrapped content. */
export function Interference({
  intensity,
  intense = false,
  glitch = false,
  corruptText,
  className = '',
  children,
  ...rest
}: InterferenceProps) {
  return (
    <div
      className={cn(
        'cd-interference',
        intensity && `cd-interference--${intensity}`,
        intense && 'cd-interference--intense',
        glitch && 'cd-interference--glitch',
        className,
      )}
      {...rest}
    >
      <div className="cd-interference__noise" />
      {glitch ? (
        <div className="cd-interference__content" data-text={corruptText}>
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
