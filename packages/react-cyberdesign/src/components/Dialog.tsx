import type { ComponentProps } from 'react';
import { Modal } from './Modal';

export type DialogProps = ComponentProps<typeof Modal>;

/** Alias for {@link Modal} — shadcn-style Dialog name. */
export function Dialog(props: DialogProps) {
  return <Modal {...props} />;
}
