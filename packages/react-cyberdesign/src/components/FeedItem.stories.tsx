import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Feed, FeedItem } from './FeedItem';
import { Badge } from './Badge';

const meta = {
  title: 'App Patterns/FeedItem',
  component: FeedItem,
  tags: ['autodocs'],
} satisfies Meta<typeof FeedItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    badge: <Badge color="red">CRIME</Badge>,
    time: '2m',
    title: 'Burglary report — 4th & Harbor',
    subtitle: 'Santa Ana · significance 7',
    selected: true,
    style: { width: 320 },
  },
};

export const List: Story = {
  args: { title: 'x' },
  render: () => {
    const [id, setId] = useState('1');
    return (
      <Feed style={{ width: 320 }}>
        {[
          { id: '1', color: 'red' as const, cat: 'CRIME', title: 'Burglary report' },
          { id: '2', color: 'amber' as const, cat: 'FIRE', title: 'Vegetation fire' },
          { id: '3', color: 'blue' as const, cat: 'WX', title: 'Wind advisory' },
        ].map((item) => (
          <FeedItem
            key={item.id}
            selected={id === item.id}
            onClick={() => setId(item.id)}
            badge={<Badge color={item.color}>{item.cat}</Badge>}
            time="now"
            title={item.title}
            subtitle="Regional"
          />
        ))}
      </Feed>
    );
  },
};
