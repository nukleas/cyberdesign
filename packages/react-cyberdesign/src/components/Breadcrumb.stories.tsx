import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from './Breadcrumb';

const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'arrow', 'dot'] },
  },
  args: {
    items: [
      { label: 'Home', href: '#' },
      { label: 'Situations', href: '#' },
      { label: 'Harbor fire' },
    ],
  },
} satisfies Meta<typeof Breadcrumb>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Slash: Story = {};
export const Arrow: Story = { args: { variant: 'arrow' } };
export const Dot: Story = { args: { variant: 'dot' } };
