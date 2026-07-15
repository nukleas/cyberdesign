import type { Meta, StoryObj } from '@storybook/react';
import { Item, ItemGroup } from './Item';
import { Badge } from './Badge';
import { Button } from './Button';

const meta = {
  title: 'Data/Item',
  component: Item,
  tags: ['autodocs'],
} satisfies Meta<typeof Item>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ItemGroup style={{ width: 340 }}>
      <Item
        bordered
        interactive
        media="◈"
        title="ambient-drift"
        description="genre · 92 bpm · curated"
        actions={<Badge color="cyan">JS</Badge>}
      />
      <Item
        bordered
        interactive
        media="♪"
        title="neon-rain"
        description="techno · 128 bpm"
        actions={<Button size="sm">Load</Button>}
      />
    </ItemGroup>
  ),
};
