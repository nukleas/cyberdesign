import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Drawer } from './Drawer';
import { Button } from './Button';

const meta = {
  title: 'Overlay/Drawer',
  component: Drawer,
  tags: ['autodocs'],
} satisfies Meta<typeof Drawer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Bottom: Story = {
  args: { open: true },
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Mobile sheet"
          description="Drawer defaults to side=bottom."
        >
          <p style={{ margin: 0, fontSize: 12, color: 'var(--cd-text-secondary)' }}>
            Use for action sheets and mobile detail views.
          </p>
        </Drawer>
      </>
    );
  },
};
