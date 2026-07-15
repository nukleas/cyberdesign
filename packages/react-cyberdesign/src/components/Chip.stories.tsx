import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Chip, ChipRow } from './Chip';

const meta = {
  title: 'App Patterns/Chip',
  component: Chip,
  tags: ['autodocs'],
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { children: 'NEAR', active: true } };

export const Row: Story = {
  render: () => {
    const [v, setV] = useState('crime');
    return (
      <ChipRow>
        {['all', 'crime', 'fire', 'weather'].map((id) => (
          <Chip key={id} active={v === id} onClick={() => setV(id)}>
            {id}
          </Chip>
        ))}
      </ChipRow>
    );
  },
};
