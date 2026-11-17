import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './ScrollArea';
import { Button } from './Button';

/**
 * Scrollable region with a thin scrollbar.
 *
 * ### Keyboard
 * A region whose content overflows and holds nothing focusable becomes a Tab
 * stop (`role="group"`; name it with `aria-label`), so the arrow keys,
 * PageUp / PageDown, Home / End and Space scroll it. A region that fits its
 * content, or that contains a focusable element, adds no Tab stop: focusing
 * that element already brings the keyboard inside.
 */
const meta = {
  title: 'Layout/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollArea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ScrollArea aria-label="Packet log" style={{ height: 160, width: 260, border: '1px solid var(--cd-border)', padding: 8 }}>
      {Array.from({ length: 24 }, (_, i) => (
        <div key={i} style={{ fontSize: 11, padding: '4px 0', color: 'var(--cd-text-secondary)' }}>
          log line {i + 1} — packet ok
        </div>
      ))}
    </ScrollArea>
  ),
};

/** Focusable content inside: the region itself is not a Tab stop. */
export const WithFocusableContent: Story = {
  render: () => (
    <ScrollArea style={{ height: 160, width: 260, border: '1px solid var(--cd-border)', padding: 8 }}>
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} style={{ padding: '4px 0' }}>
          <Button size="sm">Node {i + 1}</Button>
        </div>
      ))}
    </ScrollArea>
  ),
};
