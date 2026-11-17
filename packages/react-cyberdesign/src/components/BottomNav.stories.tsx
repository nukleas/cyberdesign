import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BottomNav } from './BottomNav';

const meta = {
  title: 'App Patterns/BottomNav',
  component: BottomNav,
  tags: ['autodocs'],
} satisfies Meta<typeof BottomNav>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { items: [] },
  render: () => {
    const [v, setV] = useState('feed');
    return (
      <div style={{ width: 360, border: '1px solid var(--cd-border)' }}>
        <div style={{ height: 80, display: 'grid', placeItems: 'center', color: 'var(--cd-text-dim)', fontSize: 11 }}>
          active: {v}
        </div>
        <BottomNav
          aria-label="Views"
          value={v}
          onValueChange={setV}
          items={[
            { id: 'map', label: 'Map', icon: '◎' },
            { id: 'feed', label: 'Feed', icon: '▤', badge: 12 },
            { id: 'stats', label: 'Stats', icon: '▥' },
            { id: 'time', label: 'Time', icon: '▸' },
          ]}
        />
      </div>
    );
  },
};
