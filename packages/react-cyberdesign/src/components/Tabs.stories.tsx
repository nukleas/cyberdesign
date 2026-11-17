import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['underline', 'pills', 'vertical'],
      table: { category: 'Appearance', defaultValue: { summary: 'underline' } },
    },
    defaultActive: {
      control: 'number',
      table: { category: 'State', defaultValue: { summary: '0' } },
    },
    hidePanels: {
      control: 'boolean',
      table: { category: 'Appearance' },
    },
  },
  args: {
    variant: 'underline',
    items: [
      { label: 'Overview', content: 'Fleet summary and active uplinks.' },
      { label: 'Logs', badge: '12', content: 'Streaming telemetry for the last hour.' },
      { label: 'Config', content: 'Node configuration and secrets.' },
      { label: 'Archive', content: 'Cold storage snapshots.', disabled: true },
    ],
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Underline: Story = {};

export const Pills: Story = {
  args: { variant: 'pills' },
};

export const Vertical: Story = {
  args: { variant: 'vertical' },
};
