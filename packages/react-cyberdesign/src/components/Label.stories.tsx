import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';
import { Input } from './Input';

const meta = {
  title: 'Form/Label',
  component: Label,
  tags: ['autodocs'],
} satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 260, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <Label htmlFor="x">Operator</Label>
      <Input id="x" placeholder="name" />
    </div>
  ),
};
