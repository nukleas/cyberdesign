import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

/**
 * Banner / alert. Semantic `variant` drives color (info, success, warning, error, accent).
 */
const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error', 'accent'],
      table: { category: 'Appearance', defaultValue: { summary: 'info' } },
    },
    size: {
      control: 'select',
      options: [undefined, 'sm'],
      table: { category: 'Appearance' },
    },
    inline: {
      control: 'boolean',
      description: 'Flatter inline banner without left bar emphasis.',
      table: { category: 'Appearance' },
    },
    title: { control: 'text', table: { category: 'Content' } },
    children: { control: 'text', table: { category: 'Content' } },
  },
  args: {
    variant: 'info',
    title: 'Uplink established',
    children: 'Encrypted channel open on port 443.',
    icon: 'ℹ',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Deploy complete',
    icon: '✓',
    children: 'Build #482 shipped to production.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Latency spike',
    icon: '⚠',
    children: 'p99 exceeded 800ms for 3 minutes.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Auth failed',
    icon: '✕',
    children: 'Token expired. Re-authenticate to continue.',
  },
};

export const Dismissible: Story = {
  args: {
    variant: 'accent',
    title: 'New firmware',
    icon: '⬡',
    children: 'v2.4.1 is available for your node cluster.',
    onDismiss: () => {},
  },
};
