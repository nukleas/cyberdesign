import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { useState } from 'react';

const meta = {
  title: 'Overlay/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Alias of `Modal` (shadcn Dialog name).' } } },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { open: true },
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open</Button>
        <Dialog open={open} onClose={() => setOpen(false)} title="Dialog alias">
          <p style={{ margin: 0, fontSize: 12 }}>Same API as Modal.</p>
        </Dialog>
      </>
    );
  },
};
