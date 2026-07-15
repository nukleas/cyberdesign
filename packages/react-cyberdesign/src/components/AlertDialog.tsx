import type { ReactNode } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface AlertDialogProps {
  open: boolean;
  onClose?: () => void;
  /** Dialog title. */
  title?: ReactNode;
  /** Body description. */
  children?: ReactNode;
  /** Confirm button label. @default 'Confirm' */
  confirmLabel?: ReactNode;
  /** Cancel button label. @default 'Cancel' */
  cancelLabel?: ReactNode;
  /** Called when confirm is pressed. */
  onConfirm?: () => void;
  /** Destructive confirm styling. */
  destructive?: boolean;
}

/** Confirmation dialog built on Modal — cancel / confirm actions. */
export function AlertDialog({
  open,
  onClose,
  title = 'Confirm',
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  destructive = false,
}: AlertDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button type="button" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={destructive ? 'danger' : 'primary'}
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
}
