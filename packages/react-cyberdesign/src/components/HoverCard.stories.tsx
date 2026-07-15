import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard } from './HoverCard';

const meta = {
  title: 'Overlay/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
} satisfies Meta<typeof HoverCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    trigger: <span style={{ color: 'var(--cd-accent)', borderBottom: '1px dashed var(--cd-accent)' }}>@operator</span>,
    title: 'Operator NH',
    description: 'Clearance: OPS · last seen 2m ago',
  },
};
