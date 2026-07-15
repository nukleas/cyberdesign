import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {
  render: () => (
    <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Skeleton shape="heading" width="3/4" />
      <Skeleton shape="text" width="full" />
      <Skeleton shape="text" width="1/2" />
    </div>
  ),
};

export const Card: Story = {
  render: () => (
    <Skeleton shape="card" style={{ width: 260, padding: 12 }}>
      <Skeleton shape="avatar" />
      <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <Skeleton shape="heading" width="3/4" />
        <Skeleton shape="text" />
        <Skeleton shape="btn" />
      </div>
    </Skeleton>
  ),
};
