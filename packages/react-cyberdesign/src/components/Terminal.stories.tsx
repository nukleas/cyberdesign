import type { Meta, StoryObj } from '@storybook/react';
import { Terminal } from './Terminal';

const meta = {
  title: 'Cyber/Terminal',
  component: Terminal,
  tags: ['autodocs'],
} satisfies Meta<typeof Terminal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'root@ocint',
    controls: true,
    crt: true,
    lines: [
      { type: 'system', text: 'boot sequence complete' },
      { type: 'prompt', prompt: 'root@net> ', text: 'status --live' },
      { type: 'output', text: 'SYS.ACTIVE · 48 nodes · 0 critical' },
      { type: 'error', text: 'warn: edge-03 unreachable' },
    ],
    style: { width: 420 },
  },
};

export const WithInput: Story = {
  args: {
    title: 'shell',
    lines: [{ type: 'output', text: 'ready.' }],
    input: true,
    inputProps: { placeholder: 'type a command…' },
    style: { width: 420 },
  },
};
