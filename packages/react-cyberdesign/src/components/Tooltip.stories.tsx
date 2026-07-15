import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { Button } from './Button';

const meta = {
  title: 'Feedback/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tip: 'Encrypted channel',
    children: <Button size="sm">Hover me</Button>,
  },
};

export const Below: Story = {
  args: {
    tip: 'Below the trigger',
    below: true,
    children: <span style={{ borderBottom: '1px dashed var(--cd-accent)', cursor: 'help' }}>hint</span>,
  },
};
