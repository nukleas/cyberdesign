import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Transport } from './Transport';
import { StatusDot } from './StatusDot';

const meta = {
  title: 'App Patterns/Transport',
  component: Transport,
  tags: ['autodocs'],
} satisfies Meta<typeof Transport>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [playing, setPlaying] = useState(false);
    return (
      <Transport
        playing={playing}
        onPlay={() => setPlaying(true)}
        onStop={() => setPlaying(false)}
      >
        <StatusDot status={playing ? 'live' : 'paused'}>
          {playing ? 'Live' : 'Paused'}
        </StatusDot>
      </Transport>
    );
  },
};
