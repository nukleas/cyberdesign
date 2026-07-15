import type { Meta, StoryObj } from '@storybook/react';
import { Command } from './Command';
import { Combobox } from './Combobox';

const meta = {
  title: 'Overlay/Command',
  component: Command,
  tags: ['autodocs'],
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Palette: Story = {
  args: {
    items: [
      { value: 'new', label: 'New node', group: 'Actions', kbd: '⌘N' },
      { value: 'deploy', label: 'Deploy fleet', group: 'Actions', kbd: '⌘D' },
      { value: 'settings', label: 'Open settings', group: 'Navigation', kbd: '⌘,' },
      { value: 'docs', label: 'Documentation', group: 'Navigation' },
    ],
  },
};

export const ComboboxDemo: Story = {
  args: { items: [] },
  render: () => (
    <Combobox
      options={[
        { value: 'orange', label: 'Orange theme' },
        { value: 'cyan', label: 'Cyan theme' },
        { value: 'green', label: 'Green theme' },
        { value: 'steel', label: 'Steel theme' },
      ]}
      placeholder="Pick a theme…"
    />
  ),
};
