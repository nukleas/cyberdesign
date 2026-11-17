import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './DatePicker';

/**
 * Read-only field with a calendar popup.
 *
 * | Key | Where | Action |
 * | --- | --- | --- |
 * | Enter / Space / ArrowDown | Field | Open the calendar; focus moves to the selected day (else today) |
 * | Arrows, Home / End, PageUp / PageDown (+Shift) | Calendar | Move through the grid, as in `Calendar` |
 * | Enter / Space | Calendar | Pick the focused day, close, return focus to the field |
 * | Escape | Calendar | Close without picking, return focus to the field |
 * | Tab / Shift+Tab | Calendar | Cycle between the month buttons and the grid |
 */
const meta = {
  title: 'Form/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
} satisfies Meta<typeof DatePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: new Date(), placeholder: 'Mission date', 'aria-label': 'Mission date' },
};
