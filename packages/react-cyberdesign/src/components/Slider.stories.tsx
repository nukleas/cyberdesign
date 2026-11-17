import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';

/**
 * Range slider: a native `<input type="range">`, so the browser provides the keys.
 *
 * | Key | Action |
 * | --- | --- |
 * | ArrowRight / ArrowUp | Increase by one `step` |
 * | ArrowLeft / ArrowDown | Decrease by one `step` |
 * | PageUp / PageDown | Increase / decrease by a larger step |
 * | Home / End | `min` / `max` |
 */
const meta = {
  title: 'Form/Slider',
  component: Slider,
  tags: ['autodocs'],
} satisfies Meta<typeof Slider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Slider defaultValue={40} style={{ width: 240 }} />,
};

export const WithValue: Story = {
  render: () => <Slider defaultValue={72} valueLabel="72%" style={{ width: 280 }} />,
};
