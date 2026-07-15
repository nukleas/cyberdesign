import type { Meta, StoryObj } from '@storybook/react';
import { PanelHeader } from './PanelHeader';
import { StatusDot } from './StatusDot';

const meta = {
  title: 'Surfaces/PanelHeader',
  component: PanelHeader,
  tags: ['autodocs'],
} satisfies Meta<typeof PanelHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Editor',
    actions: <StatusDot status="live">Live</StatusDot>,
    style: { width: 360 },
  },
};
