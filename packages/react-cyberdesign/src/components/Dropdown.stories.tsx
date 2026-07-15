import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';

const meta = {
  title: 'Navigation/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Dropdown>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultOpen: true,
    trigger: 'Actions',
    triggerClassName: 'cd-btn cd-btn--primary',
    items: [
      { label: 'Section', heading: true },
      { label: 'New node', icon: '+', kbd: '⌘N' },
      { label: 'Deploy', icon: '▲', kbd: '⌘D' },
      { sep: true },
      { label: 'Delete', icon: '✕', danger: true },
    ],
  },
};
