import type { Meta, StoryObj } from '@storybook/react';
import { Menubar } from './Menubar';

const meta = {
  title: 'Navigation/Menubar',
  component: Menubar,
  tags: ['autodocs'],
} satisfies Meta<typeof Menubar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    menus: [
      {
        label: 'File',
        items: [
          { label: 'New' },
          { label: 'Open…' },
          { label: 'Save' },
        ],
      },
      {
        label: 'Edit',
        items: [
          { label: 'Undo' },
          { label: 'Redo' },
        ],
      },
      {
        label: 'View',
        items: [
          { label: 'Toggle AI' },
          { label: 'Fullscreen viz' },
        ],
      },
    ],
  },
};
