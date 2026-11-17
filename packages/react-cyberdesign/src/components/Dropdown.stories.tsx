import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';

const meta = {
  title: 'Navigation/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
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
