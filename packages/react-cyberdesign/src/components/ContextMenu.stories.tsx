import { useState } from 'react';
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
        { sep: true },
        { label: 'Delete', danger: true },
      ]}
    >
      <GlowCard color="cyan" style={{ width: 240, padding: 24, textAlign: 'center', fontSize: 12 }}>
        Right-click this card
      </GlowCard>
    </ContextMenu>
  ),
};

/** Check, radio and switch items with hints. State lives in the consumer: `onSelect` flips `checked`. */
export const StatefulItems: Story = {
  args: { items: [], children: null },
  render: () => {
    const [hidden, setHidden] = useState(false);
    const [sort, setSort] = useState('name');
    const [preview, setPreview] = useState(true);
    return (
      <ContextMenu
        items={[
          { label: 'Open', kbd: '↵' },
          { label: 'Show hidden files', kind: 'check', checked: hidden, hint: '12', onSelect: () => setHidden((v) => !v) },
          { sep: true },
          { label: 'Sort by', heading: true },
          ...['name', 'modified', 'size'].map((id) => ({
            label: id,
            kind: 'radio' as const,
            checked: sort === id,
            onSelect: () => setSort(id),
          })),
          { sep: true },
          { label: 'Preview pane', kind: 'switch', checked: preview, onSelect: () => setPreview((v) => !v) },
          { sep: true },
          { label: 'Delete', danger: true, hint: '3 items' },
        ]}
      >
        <GlowCard color="cyan" style={{ width: 240, padding: 24, textAlign: 'center', fontSize: 12 }}>
          Right-click this card
        </GlowCard>
      </ContextMenu>
    );
  },
};
