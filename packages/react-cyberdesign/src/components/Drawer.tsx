import type { ComponentProps } from 'react';
import { Sheet } from './Sheet';

export type DrawerProps = ComponentProps<typeof Sheet>;

/**
 * Alias for {@link Sheet} with default side `bottom` (mobile drawer pattern).
 * Same keyboard behaviour: focus moves in, Tab cycles, Escape closes.
 */
export function Drawer({ side = 'bottom', ...rest }: DrawerProps) {
  return <Sheet side={side} {...rest} />;
}
