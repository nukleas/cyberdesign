import type { ComponentProps } from 'react';
import { Modal } from './Modal';

export type DialogProps = ComponentProps<typeof Modal>;

/** Alias for {@link Modal} — familiar naming for teams used to a "Dialog" component. */
export function Dialog(props: DialogProps) {
  return <Modal {...props} />;
}
