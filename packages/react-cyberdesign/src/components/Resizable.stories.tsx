import type { Meta, StoryObj } from '@storybook/react';
import { Resizable } from './Resizable';

/**
 * Two-panel split view with a draggable, focusable divider.
 *
 * ### Keyboard
 * | Key | Action |
 * | --- | --- |
 * | Tab | Focus the divider |
 * | Left / Right (side by side), Up / Down (stacked) | Resize by 2% |
 * | Shift + arrow | Resize by 10% |
 * | Home / End | First panel to `minSize` / `maxSize` |
 *
 * A panel whose content overflows and has nothing focusable inside is also a
 * Tab stop, so it can be scrolled with the arrow keys.
 */
const meta = {
  title: 'Layout/Resizable',
  component: Resizable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Resizable>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: { first: null, second: null },
  render: () => (
    <Resizable
      style={{ width: 480, height: 180 }}
      defaultSize={35}
      first={<div style={{ fontSize: 11 }}>Sidebar / AI</div>}
      second={<div style={{ fontSize: 11 }}>Main workspace</div>}
    />
  ),
};

export const Vertical: Story = {
  args: { first: null, second: null },
  render: () => (
    <Resizable
      orientation="vertical"
      style={{ width: 320, height: 220 }}
      first={<div style={{ fontSize: 11 }}>Top</div>}
      second={<div style={{ fontSize: 11 }}>Bottom</div>}
    />
  ),
};
