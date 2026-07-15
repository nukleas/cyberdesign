import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, AvatarGroup } from './Avatar';

const meta = {
  title: 'Primitives/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    status: { control: 'select', options: [undefined, 'online', 'away', 'busy', 'offline'] },
  },
  args: { fallback: 'NH', glow: true, status: 'online' },
} satisfies Meta<typeof Avatar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
        <Avatar key={s} size={s} fallback={s.slice(0, 2).toUpperCase()} glow />
      ))}
    </div>
  ),
};
export const Group: Story = {
  render: () => (
    <AvatarGroup more={3}>
      <Avatar fallback="A" status="online" />
      <Avatar fallback="B" status="away" />
      <Avatar fallback="C" status="busy" />
    </AvatarGroup>
  ),
};
