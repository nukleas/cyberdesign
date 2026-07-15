import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from './RadioGroup';

const meta = {
  title: 'Form/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'plan',
    defaultValue: 'pro',
    items: [
      { value: 'free', label: 'Free' },
      { value: 'pro', label: 'Pro', description: 'Full API access' },
      { value: 'ops', label: 'Ops' },
    ],
  },
};
