import type { Meta, StoryObj } from '@storybook/react';
import { NativeSelect } from './NativeSelect';

const meta = {
  title: 'Form/NativeSelect',
  component: NativeSelect,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Alias of `Select`.' } } },
} satisfies Meta<typeof NativeSelect>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <NativeSelect {...args} defaultValue="a" style={{ width: 200 }}>
      <option value="a">Alpha</option>
      <option value="b">Bravo</option>
    </NativeSelect>
  ),
};
