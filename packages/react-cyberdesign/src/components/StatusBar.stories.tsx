import type { Meta, StoryObj } from '@storybook/react';
import { StatusBar } from './StatusBar';
import { StatusDot } from './StatusDot';
import { Clock } from './Clock';

const meta = {
  title: 'App Patterns/StatusBar',
  component: StatusBar,
  tags: ['autodocs'],
} satisfies Meta<typeof StatusBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    leading: <StatusDot status="live" orbOnly />,
    message: 'evaluating pattern · 120 bpm',
    meta: (
      <>
        <span>untitled.strudel</span>
        <Clock showDate={false} />
      </>
    ),
    style: { width: 480 },
  },
};
