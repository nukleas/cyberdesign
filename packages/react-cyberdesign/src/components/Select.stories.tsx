import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta = {
  title: 'Form/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    label: { control: 'boolean' },
    error: { control: 'boolean' },
  },
  args: { size: 'md' },
} satisfies Meta<typeof Select>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Select {...args} defaultValue="cyan" style={{ width: 220 }}>
      <option value="orange">Orange</option>
      <option value="cyan">Cyan</option>
      <option value="green">Green</option>
    </Select>
  ),
};

export const Small: Story = {
  render: () => (
    <Select size="sm" defaultValue="a" style={{ width: 160 }}>
      <option value="a">Alpha</option>
      <option value="b">Bravo</option>
    </Select>
  ),
};

export const Error: Story = {
  render: () => (
    <Select error defaultValue="" style={{ width: 220 }}>
      <option value="" disabled>
        Required…
      </option>
      <option value="1">Option 1</option>
    </Select>
  ),
};
