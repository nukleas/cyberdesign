import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ContextMenu } from './ContextMenu';
import { GlowCard } from './GlowCard';

const keys = `
A WAI-ARIA menu opened by right-click or from the keyboard. For keyboard use, something inside the
wrapper must be focusable; pass \`tabIndex={0}\` to make the wrapper itself the target.

| Key | Action |
| --- | --- |
| Menu key / Shift+F10 | Open the menu for the focused element and focus the first item (VoiceOver: VO+Shift+M) |
| ArrowDown / ArrowUp | Next / previous enabled item, looping |
| Home / End | First / last enabled item |
| A letter | Next item whose label starts with it |
| Enter / Space | Choose the item; a \`switch\` item keeps the menu open |
| Escape | Close |
| Tab | Close and move on to the next Tab stop |

Closing returns focus to the element that had it before the menu opened. The menu is kept inside the viewport.
`;

const meta = {
  title: 'Overlay/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: { docs: { description: { component: keys } } },
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

/** A focusable target between two buttons: Tab to the card, then press the Menu key or Shift+F10. */
export const Keyboard: Story = {
  args: { items: [], children: null },
  render: () => {
    const [pinned, setPinned] = useState(false);
    const [last, setLast] = useState('nothing yet');
    const pick = (label: string) => () => setLast(label);
    return (
      <div style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
        <button type="button" className="cd-btn">Before</button>
        <ContextMenu
          tabIndex={0}
          aria-label="Node 7"
          items={[
            { label: 'Inspect', kbd: '⌘I', onSelect: pick('Inspect') },
            { label: 'Copy id', kbd: '⌘C', onSelect: pick('Copy id') },
            { label: 'Compare', disabled: true },
            { label: 'Clone', onSelect: pick('Clone') },
            { sep: true },
            { label: 'Pinned', kind: 'switch', checked: pinned, onSelect: () => setPinned((v) => !v) },
            { sep: true },
            { label: 'Delete', danger: true, onSelect: pick('Delete') },
          ]}
        >
          <GlowCard color="cyan" style={{ width: 240, padding: 24, textAlign: 'center', fontSize: 12 }}>
            Focus this card, then Menu key or Shift+F10
          </GlowCard>
        </ContextMenu>
        <button type="button" className="cd-btn">After</button>
        <p data-testid="last" style={{ fontSize: 12 }}>Last chosen: {last}</p>
      </div>
    );
  },
};
