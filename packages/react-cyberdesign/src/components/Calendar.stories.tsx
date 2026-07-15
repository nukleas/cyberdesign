import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './Calendar';
import { DatePicker } from './DatePicker';

const meta = {
  title: 'Form/Calendar',
  component: Calendar,
  tags: ['autodocs'],
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Month: Story = {
  args: { defaultSelected: new Date() },
};

export const WithDatePicker: Story = {
  render: () => <DatePicker defaultValue={new Date()} />,
};
