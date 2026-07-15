import type { ComponentProps } from 'react';
import { Sheet } from './Sheet';

export type DrawerProps = ComponentProps<typeof Sheet>;

/** Alias for {@link Sheet} with default side `bottom` (mobile drawer pattern). */
export function Drawer({ side = 'bottom', ...rest }: DrawerProps) {
  return <Sheet side={side} {...rest} />;
}
