import type { Meta, StoryObj } from '@storybook/react';
import { Empty } from './Empty';
import { Button } from './Button';

const meta = {
  title: 'Feedback/Empty',
  component: Empty,
  tags: ['autodocs'],
} satisfies Meta<typeof Empty>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'No incidents',
    description: 'The feed is quiet in this sector. Adjust filters or expand the radius.',
    actions: <Button size="sm" variant="primary">Reset filters</Button>,
  },
};
