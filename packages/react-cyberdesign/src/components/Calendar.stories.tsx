import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './Calendar';
import { DatePicker } from './DatePicker';

/**
 * Month grid calendar.
 *
 * Keyboard — the grid (`role="grid"`) is one Tab stop: the selected day, else
 * today, else the 1st. The month buttons are separate Tab stops.
 *
 * | Key | Action |
 * | --- | --- |
 * | ArrowLeft / ArrowRight | Previous / next day |
 * | ArrowUp / ArrowDown | Same weekday, previous / next week |
 * | Home / End | Start (Sunday) / end (Saturday) of the week |
 * | PageUp / PageDown | Previous / next month |
 * | Shift+PageUp / Shift+PageDown | Previous / next year |
 * | Enter / Space | Select the focused day |
 *
 * Moving past the edge of the month shows the next one. Days turned off with
 * `isDateDisabled` can be reached but not selected.
 */
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

/** Weekends cannot be selected: they take focus but Enter and Space do nothing. */
export const DisabledDates: Story = {
  args: {
    defaultSelected: new Date(2026, 0, 15),
    isDateDisabled: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
  },
};

export const WithDatePicker: Story = {
  render: () => <DatePicker defaultValue={new Date()} />,
};
