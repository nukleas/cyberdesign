import type { Meta, StoryObj } from '@storybook/react';
import { Resizable } from './Resizable';

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
