import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';

const meta = {
  title: 'Navigation/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'sep', 'flush'] },
  },
  args: {
    variant: 'default',
    items: [
      { title: 'Overview', content: 'Fleet summary and active uplinks.', defaultOpen: true, icon: '▣' },
      { title: 'Telemetry', content: 'Streaming p50/p99 and packet loss.', icon: '◫' },
      { title: 'Archives', content: 'Cold storage snapshots from last quarter.', icon: '▤' },
    ],
  },
} satisfies Meta<typeof Accordion>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Separated: Story = { args: { variant: 'sep' } };
