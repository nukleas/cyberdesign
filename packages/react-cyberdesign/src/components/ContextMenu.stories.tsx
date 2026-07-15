import type { Meta, StoryObj } from '@storybook/react';
import { ContextMenu } from './ContextMenu';
import { GlowCard } from './GlowCard';

const meta = {
  title: 'Overlay/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
} satisfies Meta<typeof ContextMenu>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { items: [], children: null },
  render: () => (
    <ContextMenu
      items={[
        { label: 'Inspect', kbd: '⌘I' },
        { label: 'Copy id', kbd: '⌘C' },
        { label: '', sep: true },
        { label: 'Delete', danger: true },
      ]}
    >
      <GlowCard color="cyan" style={{ width: 240, padding: 24, textAlign: 'center', fontSize: 12 }}>
        Right-click this card
      </GlowCard>
    </ContextMenu>
  ),
};
