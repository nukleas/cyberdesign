import type { ComponentProps } from 'react';
import { Select } from './Select';

export type NativeSelectProps = ComponentProps<typeof Select>;

/** Alias for {@link Select} — shadcn-style NativeSelect name. */
export function NativeSelect(props: NativeSelectProps) {
  return <Select {...props} />;
}
