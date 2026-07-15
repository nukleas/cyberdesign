import type { Meta, StoryObj } from '@storybook/react';
import { HudBar } from './HudBar';

const meta = {
  title: 'Cyber/HudBar',
  component: HudBar,
  tags: ['autodocs'],
} satisfies Meta<typeof HudBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    style: { width: 400 },
    segments: [
      { label: 'SPD', value: '0.82 M', status: 'ok' },
      { label: 'FUEL', value: '64%', status: 'warn' },
      { label: 'LINK', value: 'LOST', status: 'err' },
    ],
  },
};
