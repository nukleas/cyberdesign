import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Field } from './Field';
import { Label } from './Label';

/**
 * Text input with neon focus ring. Semantic props: `size`, `accent`, `error`.
 * Compose with `Field` + `Label` for labelled forms.
 */
const meta = {
  title: 'Form/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Control height density.',
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    accent: {
      control: 'boolean',
      description: 'Left accent border (search/highlight pattern).',
      table: { category: 'Appearance' },
    },
    error: {
      control: 'boolean',
      description: 'Error state — red border and glow.',
      table: { category: 'State' },
    },
    placeholder: {
      control: 'text',
      table: { category: 'Content' },
    },
    disabled: {
      control: 'boolean',
      table: { category: 'State' },
    },
  },
  args: {
    placeholder: 'Enter callsign…',
    size: 'md',
    accent: false,
    error: false,
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Accent: Story = {
  args: { accent: true, placeholder: 'Search corpus…' },
};

export const Error: Story = {
  args: { error: true, defaultValue: 'invalid@' },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </div>
  ),
};

export const WithField: Story = {
  render: () => (
    <Field description="Use a verified operator handle." style={{ width: 320 }}>
      <Label htmlFor="callsign">Callsign</Label>
      <Input id="callsign" placeholder="neon-runner" accent />
    </Field>
  ),
};
