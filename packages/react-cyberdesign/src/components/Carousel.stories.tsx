import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { Carousel } from './Carousel';

const meta = {
  title: 'Layout/Carousel',
  component: Carousel,
  tags: ['autodocs'],
} satisfies Meta<typeof Carousel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => (
    <div style={{ width: 360 }}>
      <Carousel aria-label="Fleet reports">
        <div>Slide A — fleet overview</div>
        <div>Slide B — latency heatmap</div>
        <div>Slide C — deploy timeline</div>
      </Carousel>
    </div>
  ),
};

export const WithActions: Story = {
  args: { children: null },
  render: () => (
    <div style={{ width: 360 }}>
      <Carousel aria-label="Fleet reports">
        <Button size="sm">Open overview</Button>
        <Button size="sm">Open heatmap</Button>
        <Button size="sm">Open timeline</Button>
      </Carousel>
    </div>
  ),
};
