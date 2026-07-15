import type { Meta, StoryObj } from '@storybook/react';
import { ButtonGroup } from './ButtonGroup';
import { Button } from './Button';

const meta = {
  title: 'Primitives/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof ButtonGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button size="sm">Cut</Button>
      <Button size="sm">Copy</Button>
      <Button size="sm" variant="primary">Paste</Button>
    </ButtonGroup>
  ),
};

export const Vertical: Story = {
  render: () => (
    <ButtonGroup vertical>
      <Button size="sm">Top</Button>
      <Button size="sm">Mid</Button>
      <Button size="sm">Bot</Button>
    </ButtonGroup>
  ),
};
