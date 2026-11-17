import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard } from './HoverCard';
import { Button } from './Button';

/**
 * Card shown while its trigger is hovered or focused. The trigger is a tab
 * stop and the card is its description (`aria-describedby`).
 *
 * | Key | Action |
 * | --- | --- |
 * | Tab to the trigger | Opens the card |
 * | Tab away | Closes it |
 * | Escape | Closes it; focus stays on the trigger |
 */
const meta = {
  title: 'Overlay/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
} satisfies Meta<typeof HoverCard>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Tab from the first button to the handle: the card opens. Escape or Tab closes it. */
export const Default: Story = {
  args: {
    trigger: <span style={{ color: 'var(--cd-accent)', borderBottom: '1px dashed var(--cd-accent)' }}>@operator</span>,
    title: 'Operator NH',
    description: 'Clearance: OPS · last seen 2m ago',
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', minHeight: 110 }}>
      <Button size="sm">Before</Button>
      <HoverCard {...args} />
      <Button size="sm">After</Button>
    </div>
  ),
};
