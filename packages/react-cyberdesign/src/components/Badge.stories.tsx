import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
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
  'yellow',
];

/**
 * Inline status badge. Semantic `color` prop maps to the cyberdesign palette.
 */
const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: colors,
      description: 'Neon color family.',
      table: { category: 'Appearance', defaultValue: { summary: 'orange' } },
    },
    children: {
      control: 'text',
      table: { category: 'Content' },
    },
  },
  args: {
    children: 'LIVE',
    color: 'orange',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Palette: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {colors.map((color) => (
        <Badge key={color} color={color}>
          {color}
        </Badge>
      ))}
    </div>
  ),
};
