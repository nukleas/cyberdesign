import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AlertDialog } from './AlertDialog';
import { Button } from './Button';

/**
 * Confirmation dialog (`role="alertdialog"`), named by its `title` and
 * described by its message.
 *
 * | Key | Action |
 * | --- | --- |
 * | Enter / Space on the opener | Opens with focus on **Cancel**, the least destructive action |
 * | Tab / Shift+Tab | Cycle ✕ → Cancel → Confirm; focus never reaches the page behind |
 * | Enter / Space | Activates the focused button |
 * | Escape | Cancels: calls `onClose`, never `onConfirm` |
 * | on close | Focus returns to the element that opened the dialog |
 */
const meta = {
  title: 'Overlay/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
  args: { open: false },
} satisfies Meta<typeof AlertDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Open it and press Enter straight away: nothing is deleted, because Cancel has focus. */
export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [deleted, setDeleted] = useState(0);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>Delete</Button>
        <span style={{ marginLeft: 12, fontSize: 12, color: 'var(--cd-text-muted)' }}>
          Deleted: {deleted}
        </span>
        <AlertDialog
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setDeleted((n) => n + 1)}
          title="Delete node?"
          destructive
          confirmLabel="Delete"
        >
          This action cannot be undone.
        </AlertDialog>
      </>
    );
  },
};
