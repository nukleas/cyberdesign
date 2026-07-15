import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertDialog } from './AlertDialog';

const meta = {
  title: 'Overlay/Modal',
  component: Modal,
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { open: true },
  render: () => {
    const [open, setOpen] = useState(true);
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

export const Alert: Story = {
  name: 'AlertDialog',
  args: { open: true },
  render: () => {
    const [open, setOpen] = useState(true);
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
