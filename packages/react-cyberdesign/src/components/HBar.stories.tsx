import type { Meta, StoryObj } from '@storybook/react';
import { HBar } from './HBar';

const meta = {
  title: 'Data/HBar',
  component: HBar,
  tags: ['autodocs'],
} satisfies Meta<typeof HBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { label: 'Crime', value: 72, display: 48, style: { width: 280 } },
};

export const Stack: Story = {
  args: { label: 'x', value: 0 },
  render: () => (
    <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <HBar label="Crime" value={72} display={48} />
      <HBar label="Fire" value={40} display={12} color="var(--cd-neon-amber)" />
      <HBar label="WX" value={55} display={31} color="var(--cd-neon-blue)" />
    </div>
  ),
};
