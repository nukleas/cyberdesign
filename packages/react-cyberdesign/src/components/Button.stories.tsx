import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

/**
 * Cyber terminal button. Semantic props:
 * `variant` for emphasis, `size` for density, plus native button attributes.
 */
const meta = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'danger'],
      description: 'Visual emphasis. `primary` uses theme accent; `danger` is destructive.',
      table: { category: 'Appearance', defaultValue: { summary: 'default' } },
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
      description: '`sm` is compact; `md` is default height.',
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    icon: {
      control: 'boolean',
      description: 'Square icon-only button (no horizontal padding).',
      table: { category: 'Appearance', defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      table: { category: 'State' },
    },
    children: {
      control: 'text',
      table: { category: 'Content' },
    },
  },
  args: {
    children: 'Execute',
    variant: 'default',
    size: 'md',
    icon: false,
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = {
  args: { variant: 'primary', children: 'Deploy' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Purge' },
};

export const Small: Story = {
  args: { size: 'sm', children: 'Compact' },
};

export const Icon: Story = {
  args: { icon: true, variant: 'primary', children: '⚡' },
};

export const Disabled: Story = {
  args: { disabled: true, children: 'Locked' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="danger">Danger</Button>
      <Button size="sm">Small</Button>
      <Button icon variant="primary">
        ◆
      </Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
};
