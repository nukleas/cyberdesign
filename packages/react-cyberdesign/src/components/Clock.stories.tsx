import type { Meta, StoryObj } from '@storybook/react';
import { Clock } from './Clock';

const meta = {
  title: 'App Patterns/Clock',
  component: Clock,
  tags: ['autodocs'],
} satisfies Meta<typeof Clock>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const TimeOnly: Story = { args: { showDate: false } };
export const PT: Story = { args: { timeZone: 'America/Los_Angeles' } };
