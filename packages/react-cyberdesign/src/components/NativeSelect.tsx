import type { ComponentProps } from 'react';
import { Select } from './Select';

export type NativeSelectProps = ComponentProps<typeof Select>;

/** Alias for {@link Select} — familiar naming for teams used to a "NativeSelect" component. */
export function NativeSelect(props: NativeSelectProps) {
  return <Select {...props} />;
}
