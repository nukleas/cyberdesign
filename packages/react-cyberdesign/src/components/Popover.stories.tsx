import type { Meta, StoryObj } from '@storybook/react';
import { Popover } from './Popover';
import { Button } from './Button';
import { HoverCard } from './HoverCard';

/**
 * Non-modal panel disclosed by a button (`aria-expanded`, `aria-controls`).
 *
 * | Key | Action |
 * | --- | --- |
 * | Enter / Space on the trigger | Toggles the panel; focus stays on the trigger |
 * | Tab | Moves into the panel's controls, then on to the rest of the page — Tab is not trapped |
 * | Escape | Closes and returns focus to the trigger |
 * | focus leaving, or a press outside | Closes |
 *
 * While closed, the panel's content is out of the tab order.
 */
const meta = {
  title: 'Overlay/Popover',
  component: Popover,
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Tab to the trigger, press Enter, Tab into the panel, then Escape. */
export const Default: Story = {
  args: {
    trigger: 'Details',
    triggerClassName: 'cd-btn cd-btn--sm',
    title: 'Node details',
    description: 'Latency p99 180ms · packet loss 0.01%',
    children: (
      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
        <Button size="sm">Copy ID</Button>
        <Button size="sm">Ping</Button>
      </div>
    ),
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: 8, minHeight: 140, alignItems: 'flex-start' }}>
      <Popover {...args} />
      <Button size="sm">Next control</Button>
    </div>
  ),
};

export const Hover: Story = {
  name: 'HoverCard',
  args: { trigger: null },
  render: () => (
    <HoverCard
      trigger={<span style={{ color: 'var(--cd-accent)', borderBottom: '1px dashed var(--cd-accent)', cursor: 'help' }}>@console</span>}
      title="CONSOLE"
      description="Regional intelligence feed — live civic telemetry."
    />
  ),
};
