import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';
import { RadioGroup } from './RadioGroup';

const meta = {
  title: 'Form/Radio',
  component: Radio,
  tags: ['autodocs'],
} satisfies Meta<typeof Radio>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { name: 'solo', label: 'Primary channel', defaultChecked: true },
};

export const Group: Story = {
  render: () => (
    <RadioGroup
      name="tier"
      defaultValue="pro"
      items={[
        { value: 'free', label: 'Free' },
        { value: 'pro', label: 'Pro', description: 'Full feed + API' },
        { value: 'ops', label: 'Ops', description: 'Priority ingest' },
      ]}
    />
  ),
};
