import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InputOTP } from './InputOTP';

/**
 * One-time-passcode slots: one group ("One-time code"), one Tab stop (the
 * first empty slot), each slot announced as "Digit N of M".
 *
 * | Key | Action |
 * | --- | --- |
 * | 0–9 | Fill the slot and advance; on a filled slot, replace it |
 * | Backspace | Clear the slot; on an empty slot, step back and clear the previous one |
 * | Delete | Clear the slot in place |
 * | ArrowLeft / ArrowRight | Move between the filled slots and the first empty one |
 * | Home / End | First slot / first empty slot |
 * | Paste | Fill from the focused slot onward (non-digits are dropped) |
 */
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
