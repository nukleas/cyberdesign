import type { Meta, StoryObj } from '@storybook/react';
import { Dialog } from './Dialog';
import { Button } from './Button';
import { useState } from 'react';

/**
 * Alias of `Modal` under the more familiar `Dialog` name — same API, same keys.
 *
 * | Key | Action |
 * | --- | --- |
 * | Enter / Space on the opener | Opens; focus moves to the first control inside |
 * | Tab / Shift+Tab | Cycle through the dialog's controls |
 * | Escape | Calls `onClose` |
 * | on close | Focus returns to the element that opened the dialog |
 */
const meta = {
  title: 'Overlay/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  args: { open: false },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Dialog alias"
          footer={<Button variant="primary" onClick={() => setOpen(false)}>OK</Button>}
        >
          <p style={{ margin: 0, fontSize: 12 }}>Same API as Modal.</p>
        </Dialog>
      </>
    );
  },
};
