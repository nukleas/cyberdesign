import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AlertDialog } from './AlertDialog';
import { Button } from './Button';

const meta = {
  title: 'Overlay/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
} satisfies Meta<typeof AlertDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { open: true, title: 'Confirm' },
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>Delete</Button>
        <AlertDialog
          open={open}
          onClose={() => setOpen(false)}
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
