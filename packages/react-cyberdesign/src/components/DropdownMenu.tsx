import type { ComponentProps } from 'react';
import { Dropdown } from './Dropdown';

export type DropdownMenuProps = ComponentProps<typeof Dropdown>;

/** Alias for {@link Dropdown} — shadcn-style DropdownMenu name. */
export function DropdownMenu(props: DropdownMenuProps) {
  return <Dropdown {...props} />;
}
