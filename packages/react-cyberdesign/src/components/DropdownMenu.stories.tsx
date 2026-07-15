import type { Meta, StoryObj } from '@storybook/react';
import { DropdownMenu } from './DropdownMenu';

const meta = {
  title: 'Navigation/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: 'Alias of `Dropdown`.' } } },
} satisfies Meta<typeof DropdownMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultOpen: true,
    trigger: 'Menu',
    items: [
      { label: 'Open' },
      { label: 'Save' },
      { sep: true },
      { label: 'Quit', danger: true },
    ],
  },
};
