import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';

const keys = `
A WAI-ARIA menu button. The menu is one Tab stop: its items are reached with the arrow keys.

| Key | On the trigger |
| --- | --- |
| ArrowDown / Enter / Space | Open the menu, focus the first item |
| ArrowUp | Open the menu, focus the last item |

| Key | In the menu |
| --- | --- |
| ArrowDown / ArrowUp | Next / previous enabled item, looping |
| Home / End | First / last enabled item |
| A letter | Next item whose label starts with it |
| Enter / Space | Choose the item and return focus to the trigger; a \`switch\` item keeps the menu open |
| Escape | Close and return focus to the trigger |
| Tab | Close and move on to the next Tab stop |
`;

const meta = {
  title: 'Navigation/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: { layout: 'padded', docs: { description: { component: keys } } },
} satisfies Meta<typeof Dropdown>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultOpen: true,
    trigger: 'Actions',
    triggerClassName: 'cd-btn cd-btn--primary',
    items: [
      { label: 'Section', heading: true },
      { label: 'New node', icon: '+', kbd: '⌘N' },
      { label: 'Deploy', icon: '▲', kbd: '⌘D' },
      { sep: true },
      { label: 'Delete', icon: '✕', danger: true },
    ],
  },
};

/** Check, radio and switch items with hints. State lives in the consumer: `onSelect` flips `checked`. */
export const StatefulItems: Story = {
  args: { trigger: 'View', items: [] },
  render: (args) => {
    const [wrap, setWrap] = useState(true);
    const [minimap, setMinimap] = useState(false);
    const [density, setDensity] = useState('comfortable');
    const [scanlines, setScanlines] = useState(true);
    const [glow, setGlow] = useState(false);
    return (
      <div style={{ paddingBottom: 340 }}>
        <Dropdown
          {...args}
          defaultOpen
          items={[
            { label: 'Editor', heading: true },
            { label: 'Word wrap', kind: 'check', checked: wrap, hint: '80 cols', onSelect: () => setWrap((v) => !v) },
            { label: 'Minimap', kind: 'check', checked: minimap, kbd: '⌘M', onSelect: () => setMinimap((v) => !v) },
            { sep: true },
            { label: 'Density', heading: true },
            ...['comfortable', 'compact'].map((id) => ({
              label: id,
              kind: 'radio' as const,
              checked: density === id,
              hint: id === 'comfortable' ? 'default' : 'more on screen',
              onSelect: () => setDensity(id),
            })),
            { sep: true },
            { label: 'Scanlines', kind: 'switch', checked: scanlines, hint: 'CRT overlay', onSelect: () => setScanlines((v) => !v) },
            { label: 'Glow', kind: 'switch', checked: glow, onSelect: () => setGlow((v) => !v) },
            { label: 'Telemetry', kind: 'switch', checked: false, disabled: true },
            { sep: true },
            { label: 'Reset layout', hint: '3 panes' },
          ]}
        />
      </div>
    );
  },
};

/** Starts closed between two buttons: Tab to the trigger and drive it from the keyboard. */
export const Keyboard: Story = {
  args: { trigger: 'Actions', items: [] },
  render: (args) => {
    const [pinned, setPinned] = useState(false);
    const [last, setLast] = useState('nothing yet');
    const pick = (label: string) => () => setLast(label);
    return (
      <div style={{ paddingBottom: 260 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button type="button" className="cd-btn">Before</button>
          <Dropdown
            {...args}
            items={[
              { label: 'Deploy', kbd: '⌘D', onSelect: pick('Deploy') },
              { label: 'Duplicate', onSelect: pick('Duplicate') },
              { label: 'Archive', disabled: true },
              { label: 'Rename', onSelect: pick('Rename') },
              { sep: true },
              { label: 'Pinned', kind: 'switch', checked: pinned, onSelect: () => setPinned((v) => !v) },
              { sep: true },
              { label: 'Delete', danger: true, onSelect: pick('Delete') },
            ]}
          />
          <button type="button" className="cd-btn">After</button>
        </div>
        <p data-testid="last" style={{ fontSize: 12 }}>Last chosen: {last}</p>
      </div>
    );
  },
};
