import type { Meta, StoryObj } from '@storybook/react';
import { Gauge } from './Gauge';

const meta = {
  title: 'Cyber/Gauge',
  component: Gauge,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    variant: { control: 'select', options: [undefined, 'danger', 'success', 'warn'] },
  },
  args: { value: 72, label: 'CPU', display: '72%' },
} satisfies Meta<typeof Gauge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Radar: Story = { args: { radar: true, value: 48, label: 'SCAN' } };
export const Danger: Story = { args: { variant: 'danger', value: 91, label: 'HEAT' } };
export const Row: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Gauge value={64} label="CPU" />
      <Gauge value={38} label="MEM" size="small" />
      <Gauge value={88} label="NET" variant="warn" />
    </div>
  ),
};
