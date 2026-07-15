import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';

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
