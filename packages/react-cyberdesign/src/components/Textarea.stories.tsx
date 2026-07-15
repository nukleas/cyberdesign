import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta = {
  title: 'Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: { placeholder: 'Paste briefing…', rows: 4 },
} satisfies Meta<typeof Textarea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <Textarea {...args} style={{ width: 320 }} />,
};

export const Error: Story = {
  render: () => <Textarea error defaultValue="invalid payload" style={{ width: 320 }} rows={3} />,
};
