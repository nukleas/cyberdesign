import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Transport } from './Transport';
import { StatusDot } from './StatusDot';

/**
 * Play / Stop cluster.
 *
 * ### Keyboard
 * | Key | Action |
 * | --- | --- |
 * | Tab | Focus the enabled button |
 * | Enter / Space | Press it; focus moves to the other button, so the same key toggles back |
 */
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
