import type { Meta, StoryObj } from '@storybook/react';
import { Kbd } from './Kbd';

const meta = {
  title: 'Primitives/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  args: { children: '⌘K' },
} satisfies Meta<typeof Kbd>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Combo: Story = {
  render: () => (
    <span style={{ display: 'flex', gap: 4, alignItems: 'center', fontSize: 12, color: 'var(--cd-text-muted)' }}>
      Open command palette <Kbd>⌘</Kbd><Kbd>K</Kbd>
    </span>
  ),
};
