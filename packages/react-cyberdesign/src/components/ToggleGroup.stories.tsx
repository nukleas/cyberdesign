import type { Meta, StoryObj } from '@storybook/react';
import { ToggleGroup } from './ToggleGroup';

const meta = {
  title: 'Primitives/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof ToggleGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
  args: {
    defaultValue: 'week',
    items: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
    ],
  },
};

export const Multiple: Story = {
  args: {
    multiple: true,
    defaultValue: ['b', 'i'],
    items: [
      { value: 'b', label: 'B' },
      { value: 'i', label: 'I' },
      { value: 'u', label: 'U' },
    ],
  },
};
