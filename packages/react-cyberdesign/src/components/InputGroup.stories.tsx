import type { Meta, StoryObj } from '@storybook/react';
import { InputGroup, InputGroupAddon } from './InputGroup';
import { Input } from './Input';

const meta = {
  title: 'Form/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof InputGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const PrefixSuffix: Story = {
  render: () => (
    <InputGroup style={{ width: 320 }}>
      <InputGroupAddon>sk-</InputGroupAddon>
      <Input type="password" placeholder="api key" />
    </InputGroup>
  ),
};

export const Url: Story = {
  render: () => (
    <InputGroup style={{ width: 360 }}>
      <InputGroupAddon>https://</InputGroupAddon>
      <Input placeholder="domain.com" />
      <InputGroupAddon>/api</InputGroupAddon>
    </InputGroup>
  ),
};
