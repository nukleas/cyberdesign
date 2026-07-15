import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface ScannerProps extends HTMLAttributes<HTMLDivElement> {
  /** Sweep top-to-bottom instead of left-to-right. */
  vertical?: boolean;
  /** Fainter return-sweep look. */
  ping?: boolean;
  /** Content scanned by the sweep line. */
  children?: ReactNode;
}

/** Animated scan/sweep-line overlay — wraps content with a glowing lidar/radar sweep. */
export function Scanner({
  vertical = false,
  ping = false,
  className = '',
  children,
  ...rest
}: ScannerProps) {
  return (
    <div
      className={cn(
        'cd-scanner',
        vertical && 'cd-scanner--vertical',
        ping && 'cd-scanner--ping',
        className,
      )}
      {...rest}
    >
      <div className="cd-scanner__line" />
      {children}
    </div>
  );
}
