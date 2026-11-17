import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Sheet } from './Sheet';
import { Button } from './Button';

/**
 * Edge panel that behaves as a modal dialog, named by its `title` and
 * described by its `description`.
 *
 * | Key | Action |
 * | --- | --- |
 * | Enter / Space on the opener | Opens; focus moves to the first control inside (the panel itself when it has none) |
 * | Tab / Shift+Tab | Cycle through the sheet's controls; focus never reaches the page behind |
 * | Escape | Calls `onClose` |
 * | on close | Focus returns to the element that opened the sheet |
 *
 * While closed, the sheet's content is out of the tab order.
 */
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
  args: { open: false },
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Press the button, Tab around, then Escape: focus lands back on the button. */
export const Right: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
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
