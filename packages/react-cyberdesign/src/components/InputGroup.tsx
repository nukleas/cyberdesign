import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/** Prefix/suffix input group — place `InputGroupAddon` and `Input` as children. */
export function InputGroup({ className = '', children, ...rest }: InputGroupProps) {
  return (
    <div className={cn('cd-input-group', className)} {...rest}>
      {children}
    </div>
  );
}

export interface InputGroupAddonProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
}

export function InputGroupAddon({ className = '', children, ...rest }: InputGroupAddonProps) {
  return (
    <span className={cn('cd-input-addon', className)} {...rest}>
      {children}
    </span>
  );
}

Object.assign(InputGroup, { Addon: InputGroupAddon });
