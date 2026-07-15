import type { Meta, StoryObj } from '@storybook/react';
import { SectionHeader } from './SectionHeader';
import { Chip } from './Chip';
import { StatusDot } from './StatusDot';

const meta = {
  title: 'App Patterns/SectionHeader',
  component: SectionHeader,
  tags: ['autodocs'],
} satisfies Meta<typeof SectionHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Intel feed',
    actions: (
      <>
        <Chip active size="sm">NEAR</Chip>
        <StatusDot status="live">SYS.ACTIVE</StatusDot>
      </>
    ),
    style: { width: 360 },
  },
};
