import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Sheet } from './Sheet';
import { Button } from './Button';

const meta = {
  title: 'Overlay/Sheet',
  component: Sheet,
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
      table: { category: 'Appearance' },
    },
    size: {
      control: 'select',
      options: ['sm', 'default', 'lg'],
      table: { category: 'Appearance' },
    },
  },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {
  args: { open: true },
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Open sheet
        </Button>
        <Sheet
          open={open}
          onClose={() => setOpen(false)}
          side="right"
          title="Inspector"
          description="Review node metadata before deploy."
          footer={
            <Button variant="primary" onClick={() => setOpen(false)}>
              Apply
            </Button>
          }
        >
          <p style={{ margin: 0, color: 'var(--cd-text-secondary)', fontSize: 12 }}>
            Side panels slide in from any edge. Use Drawer for bottom mobile sheets.
          </p>
        </Sheet>
      </>
    );
  },
};
