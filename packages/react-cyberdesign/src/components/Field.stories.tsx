import type { Meta, StoryObj } from '@storybook/react';
import { Field } from './Field';
import { Label } from './Label';
import { Input } from './Input';

const meta = {
  title: 'Form/Field',
  component: Field,
  tags: ['autodocs'],
} satisfies Meta<typeof Field>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field description="Used on situation briefings." style={{ width: 300 }}>
      <Label htmlFor="t">Title</Label>
      <Input id="t" placeholder="Incident name" />
    </Field>
  ),
};

export const Error: Story = {
  render: () => (
    <Field error="Callsign already registered" style={{ width: 300 }}>
      <Label htmlFor="c">Callsign</Label>
      <Input id="c" error defaultValue="dup-01" />
    </Field>
  ),
};

export const Inline: Story = {
  render: () => (
    <Field inline style={{ width: 360 }}>
      <Label htmlFor="q">Query</Label>
      <Input id="q" placeholder="search…" />
    </Field>
  ),
};
