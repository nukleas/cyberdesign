import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Drawer } from './Drawer';
import { Button } from './Button';

/**
 * `Sheet` that slides up from the bottom — same API, same keys.
 *
 * | Key | Action |
 * | --- | --- |
 * | Enter / Space on the opener | Opens; focus moves to the first control inside |
 * | Tab / Shift+Tab | Cycle through the drawer's controls |
 * | Escape | Calls `onClose` |
 * | on close | Focus returns to the element that opened the drawer |
 */
const meta = {
  title: 'Overlay/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  args: { open: false },
} satisfies Meta<typeof Drawer>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Bottom: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Mobile sheet"
          description="Drawer defaults to side=bottom."
          footer={
            <>
              <Button onClick={() => setOpen(false)}>Dismiss</Button>
              <Button variant="primary" onClick={() => setOpen(false)}>Acknowledge</Button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: 12, color: 'var(--cd-text-secondary)' }}>
            Use for action sheets and mobile detail views.
          </p>
        </Drawer>
      </>
    );
  },
};
