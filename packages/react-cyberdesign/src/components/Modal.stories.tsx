import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertDialog } from './AlertDialog';
import { Popover } from './Popover';

/**
 * Modal dialog (`role="dialog"`, `aria-modal`), named by its `title`.
 *
 * | Key | Action |
 * | --- | --- |
 * | Enter / Space on the opener | Opens; focus moves to the first control inside (the panel itself when it has none) |
 * | Tab / Shift+Tab | Cycle through the dialog's controls; focus never reaches the page behind |
 * | Escape | Calls `onClose` (the innermost open overlay closes first) |
 * | on close | Focus returns to the element that opened the dialog |
 *
 * While closed, the dialog's content is out of the tab order.
 */
const meta = {
  title: 'Overlay/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: { open: false },
} satisfies Meta<typeof Modal>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Press the button, Tab around, then Escape: focus lands back on the button. */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Confirm deploy"
          footer={
            <>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>Deploy</Button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: 12, color: 'var(--cd-text-secondary)' }}>
            Ship build #482 to production nodes in west sector?
          </p>
        </Modal>
      </>
    );
  },
};

/** No controls inside: the panel itself takes focus, Tab stays put and Escape closes. */
export const TextOnly: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open notice</Button>
        <Modal open={open} onClose={() => setOpen(false)} title="Maintenance window" hideClose>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--cd-text-secondary)' }}>
            West sector goes read-only at 02:00 UTC. Press Escape to dismiss.
          </p>
        </Modal>
      </>
    );
  },
};

/**
 * Overlays inside a modal. Escape closes one layer at a time — popover, then
 * alert dialog, then the modal — and each layer hands focus back to its opener.
 */
export const Nested: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [confirm, setConfirm] = useState(false);
    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>Open settings</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Node settings"
          footer={<Button onClick={() => setOpen(false)}>Done</Button>}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', minHeight: 130 }}>
            <Popover trigger="Details" title="Node details" description="Latency p99 180ms">
              <Button size="sm" style={{ marginTop: 8 }}>Copy ID</Button>
            </Popover>
            <Button variant="danger" onClick={() => setConfirm(true)}>Purge…</Button>
          </div>
        </Modal>
        {/* A sibling, not a child: the modal panel clips and re-anchors fixed descendants. */}
        <AlertDialog
          open={confirm}
          onClose={() => setConfirm(false)}
          title="Purge archive?"
          destructive
          confirmLabel="Purge"
        >
          This permanently deletes cold storage snapshots.
        </AlertDialog>
      </>
    );
  },
};

export const Alert: Story = {
  name: 'AlertDialog',
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>Purge</Button>
        <AlertDialog
          open={open}
          onClose={() => setOpen(false)}
          title="Purge archive?"
          destructive
          confirmLabel="Purge"
          onConfirm={() => {}}
        >
          This permanently deletes cold storage snapshots. This cannot be undone.
        </AlertDialog>
      </>
    );
  },
};
