import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InputOTP } from './InputOTP';

const meta = {
  title: 'Form/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
} satisfies Meta<typeof InputOTP>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [v, setV] = useState('');
    return <InputOTP value={v} onChange={setV} />;
  },
};

export const Split: Story = {
  render: () => {
    const [v, setV] = useState('48291');
    return <InputOTP length={6} value={v} onChange={setV} separatorAfter={3} />;
  },
};
