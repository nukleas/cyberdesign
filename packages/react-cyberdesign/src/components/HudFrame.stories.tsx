import type { Meta, StoryObj } from '@storybook/react';
import { HudFrame } from './HudFrame';
import { HudBar } from './HudBar';

const meta = {
  title: 'Cyber/HudFrame',
  component: HudFrame,
  tags: ['autodocs'],
} satisfies Meta<typeof HudFrame>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Altitude',
    value: '12.4 km',
    status: 'ok',
    floating: true,
    style: { width: 160 },
  },
};

export const Bar: Story = {
  name: 'HudBar',
  render: () => (
    <HudBar
      style={{ width: 360 }}
      segments={[
        { label: 'SPD', value: '0.82 M', status: 'ok' },
        { label: 'FUEL', value: '64%', status: 'warn' },
        { label: 'LINK', value: 'LOST', status: 'err' },
      ]}
    />
  ),
};
