import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Item, ItemGroup } from './Item';
import { Badge } from './Badge';
import { Button } from './Button';

/**
 * List row primitive.
 *
 * ### Keyboard
 * An `interactive` row is one control (`role="button"`): Tab focuses it and
 * Enter / Space fire `onClick`. A row that carries its own controls in
 * `actions` stays static, and those controls take the focus instead.
 */
const meta = {
  title: 'Data/Item',
  component: Item,
  tags: ['autodocs'],
} satisfies Meta<typeof Item>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [opened, setOpened] = useState(0);
    return (
      <ItemGroup style={{ width: 340 }}>
        <Item
          bordered
          interactive
          onClick={() => setOpened((n) => n + 1)}
          media="◈"
          title="ambient-drift"
          description={`genre · 92 bpm · opened ${opened}×`}
          actions={<Badge color="cyan">JS</Badge>}
        />
        <Item
          bordered
          media="♪"
          title="neon-rain"
          description="techno · 128 bpm"
          actions={<Button size="sm">Load</Button>}
        />
      </ItemGroup>
    );
  },
};
