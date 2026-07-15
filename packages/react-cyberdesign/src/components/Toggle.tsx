import { useState } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Controlled pressed state. */
  pressed?: boolean;
  /** Uncontrolled initial state. */
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  size?: 'sm' | 'md';
  variant?: 'default' | 'outline';
  children?: ReactNode;
}

/** Two-state toggle button (pressed / unpressed). */
export function Toggle({
  pressed,
  defaultPressed = false,
  onPressedChange,
  size = 'md',
  variant = 'default',
  className = '',
  children,
  ...rest
}: ToggleProps) {
  const [internal, setInternal] = useState(defaultPressed);
  const isOn = pressed ?? internal;

  const { onClick, ...buttonRest } = rest;

  return (
    <button
      type="button"
      className={cn(
        'cd-toggle',
        size === 'sm' && 'cd-toggle--sm',
        variant === 'outline' && 'cd-toggle--outline',
        isOn && 'is-on',
        className,
      )}
      data-state={isOn ? 'on' : 'off'}
      aria-pressed={isOn}
      onClick={(e) => {
        onClick?.(e);
        const next = !isOn;
        if (pressed == null) setInternal(next);
        onPressedChange?.(next);
      }}
      {...buttonRest}
    >
      {children}
    </button>
  );
}
