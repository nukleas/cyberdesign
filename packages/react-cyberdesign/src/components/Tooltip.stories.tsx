import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import { Button } from './Button';
import { Kbd } from './Kbd';

/**
 * Floating tooltip. The bubble is portalled to `document.body`, so it is never
 * clipped by a scrolling ancestor; it flips above/below and is clamped to the
 * viewport. Hover a trigger, or Tab to it — Escape dismisses.
 */
const meta = {
  title: 'Feedback/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    tip: {
      control: 'text',
      description: 'Tooltip content. Nothing is shown when it is empty.',
      table: { category: 'Content' },
    },
    side: {
      control: 'inline-radio',
      options: ['top', 'bottom'],
      description: 'Preferred side; flips when there is no room.',
      table: { category: 'Appearance', defaultValue: { summary: 'top' } },
    },
    children: {
      control: false,
      table: { category: 'Content' },
    },
  },
  args: {
    tip: 'Encrypted channel',
    children: <Button size="sm">Hover or focus me</Button>,
  },
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Bottom: Story = {
  args: {
    tip: 'Below the trigger',
    side: 'bottom',
  },
};

/** `tip` takes any node; long content wraps at the bubble's max width. */
export const RichContent: Story = {
  args: {
    tip: (
      <>
        Open the command palette <Kbd>⌘</Kbd> <Kbd>K</Kbd>
      </>
    ),
    children: <Button size="sm">Commands</Button>,
  },
};

/** The bubble escapes an `overflow: auto` ancestor, and hides when that box scrolls. */
export const InsideOverflow: Story = {
  render: (args) => (
    <div
      style={{
        width: 180,
        height: 120,
        overflow: 'auto',
        border: '1px solid var(--cd-border)',
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 8,
      }}
    >
      {['relay-01', 'relay-02', 'relay-03', 'relay-04', 'relay-05', 'relay-06'].map((node) => (
        <Tooltip key={node} {...args} tip={`${node} — uplink stable, last handshake 4s ago`}>
          <Button size="sm">{node}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

/**
 * Triggers in the window corners: the bubble is clamped horizontally (the
 * arrow keeps pointing at the trigger) and flips when its side has no room.
 */
export const NearEdge: Story = {
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <div
      style={{
        height: 'calc(100vh - 48px)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignContent: 'space-between',
      }}
    >
      {(['start', 'end', 'start', 'end'] as const).map((justify, i) => (
        <div key={i} style={{ justifySelf: justify }}>
          <Tooltip {...args} tip="Clamped to the viewport, arrow still on the trigger">
            <Button size="sm">Edge</Button>
          </Tooltip>
        </div>
      ))}
    </div>
  ),
};
