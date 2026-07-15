import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './Progress';

const meta = {
  title: 'Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    variant: { control: 'select', options: ['default', 'danger', 'success', 'warning'] },
  },
  args: { value: 65 },
} satisfies Meta<typeof Progress>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Progress {...args} style={{ width: 280 }} />,
};
export const Thick: Story = {
  render: () => <Progress value={40} thick style={{ width: 280 }} />,
};
export const Indeterminate: Story = {
  render: () => <Progress indeterminate style={{ width: 280 }} />,
};
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 280 }}>
      <Progress value={80} />
      <Progress value={55} variant="success" />
      <Progress value={35} variant="warning" />
      <Progress value={20} variant="danger" />
    </div>
  ),
};
