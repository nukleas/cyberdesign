import type { Meta, StoryObj } from '@storybook/react';
import { Ticker } from './Ticker';

const meta = {
  title: 'Cyber/Ticker',
  component: Ticker,
  tags: ['autodocs'],
} satisfies Meta<typeof Ticker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      'INCIDENT · harbor fire contained',
      'WX · coastal wind advisory',
      'TRANSIT · 5 delayed routes',
      'PORT · wind 18 kn',
    ],
    style: { width: 400 },
  },
};

export const Fast: Story = {
  args: {
    speed: 'fast',
    items: ['α packet', 'β packet', 'γ packet', 'δ packet'],
    style: { width: 320 },
  },
};
