import { useEffect, useId } from 'react';
import type { ReactNode } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export interface AlertDialogProps {
  open: boolean;
  /** Fired by Cancel, Escape, a backdrop press, the ✕ button, and after `onConfirm`. */
  onClose?: () => void;
  /** Dialog title; it names the dialog. */
  title?: ReactNode;
  /** The message; it is announced as the dialog's description. */
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

/**
 * Confirmation dialog built on Modal (`role="alertdialog"`) — cancel / confirm actions.
 *
 * Opens with focus on Cancel, the least destructive action, so a stray Enter
 * never confirms. Escape cancels: it calls `onClose` and never `onConfirm`.
 */
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
  const messageId = useId();
  const cancelId = useId();

  // Runs after Modal's own effect, which has just focused its first control (the ✕).
  useEffect(() => {
    if (open) document.getElementById(cancelId)?.focus();
  }, [open, cancelId]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      role="alertdialog"
      aria-describedby={messageId}
      footer={
        <>
          <Button id={cancelId} type="button" onClick={onClose}>
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
      <div id={messageId}>{children}</div>
    </Modal>
  );
}
