import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './Separator';

const meta = {
  title: 'Primitives/Separator',
  component: Separator,
  tags: ['autodocs'],
} satisfies Meta<typeof Separator>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {
  render: () => <div style={{ width: 280 }}><Separator /></div>,
};
export const Neon: Story = {
  render: () => <div style={{ width: 280 }}><Separator neon /></div>,
};
export const Labeled: Story = {
  render: () => <div style={{ width: 280 }}><Separator>OR</Separator></div>,
};
