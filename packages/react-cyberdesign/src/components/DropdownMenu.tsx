import type { ComponentProps } from 'react';
import { Dropdown } from './Dropdown';

export type DropdownMenuProps = ComponentProps<typeof Dropdown>;

/** Alias for {@link Dropdown} — familiar naming for teams used to a "DropdownMenu" component. */
export function DropdownMenu(props: DropdownMenuProps) {
  return <Dropdown {...props} />;
}
