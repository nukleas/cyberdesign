import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** `sm` is the compact track; default is the standard size. */
  size?: 'sm' | 'md';
  /** Text shown beside the toggle. */
  label?: ReactNode;
}

/** Toggle switch — visually-hidden checkbox driving a neon track + thumb. */
export function Switch({ size = 'md', label, className = '', ...rest }: SwitchProps) {
  return (
    <label className={cn('cd-switch', size === 'sm' && 'cd-switch--sm', className)}>
      <input type="checkbox" className="cd-switch__input" {...rest} />
      <span className="cd-switch__track">
        <span className="cd-switch__thumb" />
      </span>
      {label != null && <span className="cd-switch__label">{label}</span>}
    </label>
  );
}
