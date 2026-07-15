import type { Meta, StoryObj } from '@storybook/react';
import { Interference } from './Interference';

const meta = {
  title: 'Cyber/Interference',
  component: Interference,
  tags: ['autodocs'],
} satisfies Meta<typeof Interference>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Interference glitch corruptText="SIGNAL LOST" style={{ width: 280, height: 120 }}>
      <div
        style={{
          height: '100%',
          display: 'grid',
          placeItems: 'center',
          background: 'var(--cd-bg-panel)',
          border: '1px solid var(--cd-border)',
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: 'var(--cd-accent)',
        }}
      >
        SIGNAL LOST
      </div>
    </Interference>
  ),
};
