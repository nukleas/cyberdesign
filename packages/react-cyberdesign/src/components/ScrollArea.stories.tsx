import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './ScrollArea';

const meta = {
  title: 'Layout/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollArea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ScrollArea style={{ height: 160, width: 260, border: '1px solid var(--cd-border)', padding: 8 }}>
      {Array.from({ length: 24 }, (_, i) => (
        <div key={i} style={{ fontSize: 11, padding: '4px 0', color: 'var(--cd-text-secondary)' }}>
          log line {i + 1} — packet ok
        </div>
      ))}
    </ScrollArea>
  ),
};
