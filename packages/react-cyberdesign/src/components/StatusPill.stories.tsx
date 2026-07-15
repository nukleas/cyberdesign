import type { Meta, StoryObj } from '@storybook/react';
import { StatusPill } from './StatusPill';

const meta = {
  title: 'App Patterns/StatusPill',
  component: StatusPill,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'active', 'developing', 'resolved', 'success', 'critical', 'muted'],
    },
  },
  args: { variant: 'active', children: 'ACTIVE' },
} satisfies Meta<typeof StatusPill>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const All: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {(['active', 'developing', 'resolved', 'critical', 'muted'] as const).map((v) => (
        <StatusPill key={v} variant={v}>{v}</StatusPill>
      ))}
    </div>
  ),
};
