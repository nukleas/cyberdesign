import type { Meta, StoryObj } from '@storybook/react';
import { StatusDot } from './StatusDot';
import { StatusPill } from './StatusPill';

const meta = {
  title: 'App Patterns/StatusDot',
  component: StatusDot,
  tags: ['autodocs'],
  argTypes: {
    status: { control: 'select', options: ['live', 'success', 'warn', 'danger', 'paused', 'idle'] },
  },
  args: { status: 'live', children: 'SYS.ACTIVE' },
} satisfies Meta<typeof StatusDot>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Gallery: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <StatusDot status="live">Live</StatusDot>
      <StatusDot status="paused">Paused</StatusDot>
      <StatusDot status="warn">Degraded</StatusDot>
      <StatusDot status="danger">Critical</StatusDot>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
        <StatusPill variant="active">Active</StatusPill>
        <StatusPill variant="developing">Developing</StatusPill>
        <StatusPill variant="critical">SEV 4</StatusPill>
        <StatusPill variant="resolved">Resolved</StatusPill>
        <StatusPill variant="muted">Archived</StatusPill>
      </div>
    </div>
  ),
};
