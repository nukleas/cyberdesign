import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from './Popover';
import { Button } from './Button';
import { HoverCard } from './HoverCard';

const meta = {
  title: 'Overlay/Popover',
  component: Popover,
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultOpen: true,
    trigger: <Button size="sm">Open</Button>,
    title: 'Node details',
    description: 'Latency p99 180ms · packet loss 0.01%',
    children: <div style={{ marginTop: 8, fontSize: 11 }}>Region: west-1</div>,
  },
};

export const Hover: Story = {
  name: 'HoverCard',
  args: { trigger: null },
  render: () => (
    <HoverCard
      trigger={<span style={{ color: 'var(--cd-accent)', borderBottom: '1px dashed var(--cd-accent)', cursor: 'help' }}>@ocint</span>}
      title="OCINT"
      description="Orange County intelligence feed — live civic telemetry."
    />
  ),
};
