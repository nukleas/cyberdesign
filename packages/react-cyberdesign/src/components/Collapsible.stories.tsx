import type { Meta, StoryObj } from '@storybook/react';
import { Collapsible } from './Collapsible';

const meta = {
  title: 'Overlay/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
} satisfies Meta<typeof Collapsible>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultOpen: true,
    trigger: 'Advanced options',
    children: (
      <p style={{ margin: 0, paddingBottom: 8, fontSize: 12 }}>
        Tunables for retry budget, backoff, and circuit breakers.
      </p>
    ),
    style: { width: 320 },
  },
};
