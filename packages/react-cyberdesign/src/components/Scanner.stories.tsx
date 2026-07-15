import type { Meta, StoryObj } from '@storybook/react';
import { Scanner } from './Scanner';

const meta = {
  title: 'Cyber/Scanner',
  component: Scanner,
  tags: ['autodocs'],
} satisfies Meta<typeof Scanner>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Scanner style={{ width: 280, height: 140 }}>
      <div
        style={{
          height: '100%',
          background: 'var(--cd-bg-panel)',
          border: '1px solid var(--cd-border)',
          display: 'grid',
          placeItems: 'center',
          fontSize: 12,
          color: 'var(--cd-text-muted)',
        }}
      >
        SCAN TARGET
      </div>
    </Scanner>
  ),
};

export const VerticalPing: Story = {
  render: () => (
    <Scanner vertical ping style={{ width: 280, height: 140 }}>
      <div style={{ height: '100%', background: 'var(--cd-bg-panel)' }} />
    </Scanner>
  ),
};
