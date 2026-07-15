import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from './Combobox';

const meta = {
  title: 'Form/Combobox',
  component: Combobox,
  tags: ['autodocs'],
} satisfies Meta<typeof Combobox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Pick theme…',
    options: [
      { value: 'orange', label: 'Orange' },
      { value: 'cyan', label: 'Cyan' },
      { value: 'green', label: 'Green' },
      { value: 'steel', label: 'Steel' },
    ],
  },
};
