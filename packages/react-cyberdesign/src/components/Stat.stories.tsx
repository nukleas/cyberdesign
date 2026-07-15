import type { Meta, StoryObj } from '@storybook/react';
import { Stat, StatGrid } from './Stat';
import { HBar } from './HBar';

const meta = {
  title: 'Data/Stat',
  component: Stat,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'accent', 'red', 'yellow', 'blue', 'magenta'],
    },
  },
  args: { label: 'Today', value: 142, variant: 'accent', delta: '+12', trend: 'up' },
} satisfies Meta<typeof Stat>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Grid: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <StatGrid>
        <Stat label="Today" value={142} variant="accent" delta="+12" trend="up" />
        <Stat label="7 day" value={891} />
        <Stat label="Fires" value={3} variant="yellow" />
        <Stat label="Outages" value={11} variant="red" delta="-2" trend="down" />
      </StatGrid>
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <HBar label="Crime" value={72} display={48} />
        <HBar label="Fire" value={40} display={12} color="var(--cd-neon-amber)" />
        <HBar label="Transit" value={55} display={31} color="var(--cd-neon-green)" />
      </div>
    </div>
  ),
};
