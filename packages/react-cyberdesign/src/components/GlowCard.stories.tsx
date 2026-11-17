import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GlowCard } from './GlowCard';
import type { CdColor } from '../lib/types';

const colors: CdColor[] = [
  'orange',
  'amber',
  'gold',
  'cyan',
  'magenta',
  'green',
  'red',
  'blue',
  'purple',
];

/**
 * Primary surface panel with neon border glow. Use `color` + `active` for selection UIs.
 *
 * ### Keyboard
 * A card given `onClick` is one control (`role="button"`, `aria-pressed` from
 * `active`): Tab focuses it and Enter / Space fire `onClick`. A card without
 * `onClick` is a plain surface and is not focusable.
 */
const meta = {
  title: 'Surfaces/GlowCard',
  component: GlowCard,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: colors,
      table: { category: 'Appearance', defaultValue: { summary: 'orange' } },
    },
    active: {
      control: 'boolean',
      description: 'Selected state (`data-active`).',
      table: { category: 'State' },
    },
  },
  args: {
    color: 'orange',
    active: false,
    children: (
      <div>
        <div style={{ fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>NODE-07</div>
        <div style={{ color: 'var(--cd-text-muted)', fontSize: 12 }}>Status: nominal</div>
      </div>
    ),
  },
} satisfies Meta<typeof GlowCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: { active: true, color: 'cyan' },
};

/** Clickable cards as a selection UI, operable with Tab and Enter / Space. */
export const Selectable: Story = {
  render: () => {
    const [selected, setSelected] = useState<CdColor>('cyan');
    return (
      <div style={{ display: 'flex', gap: 12 }}>
        {colors.slice(3, 6).map((color) => (
          <GlowCard
            key={color}
            color={color}
            active={color === selected}
            onClick={() => setSelected(color)}
            style={{ padding: 16, width: 120 }}
          >
            <div style={{ fontSize: 12, textTransform: 'uppercase' }}>{color}</div>
          </GlowCard>
        ))}
      </div>
    );
  },
};

export const Grid: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, minmax(120px, 1fr))',
        gap: 12,
        width: 480,
      }}
    >
      {colors.slice(0, 6).map((color, i) => (
        <GlowCard key={color} color={color} active={i === 1}>
          <div style={{ fontSize: 12, textTransform: 'uppercase' }}>{color}</div>
        </GlowCard>
      ))}
    </div>
  ),
};
