import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Terminal } from './Terminal';

/**
 * Terminal window: header, scrollable log, optional command input.
 *
 * ### Keyboard
 * | Key | Action |
 * | --- | --- |
 * | Tab | Window controls (when `onControl` is set), the log (when it overflows), the command input |
 * | Enter / Space | Press the focused window control |
 * | Arrows / PageUp / PageDown / Home / End | Scroll the focused log |
 *
 * Without `onControl` the control dots are decoration and are skipped.
 */
const meta = {
  title: 'Cyber/Terminal',
  component: Terminal,
  tags: ['autodocs'],
} satisfies Meta<typeof Terminal>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'root@console',
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

/** `onControl` turns the dots into named buttons; a log that overflows is a Tab stop. */
export const ControlsAndLongLog: Story = {
  render: () => {
    const [last, setLast] = useState('none');
    return (
      <Terminal
        title={`last control: ${last}`}
        controls
        onControl={setLast}
        style={{ width: 420, height: 220 }}
        lines={Array.from({ length: 40 }, (_, i) => ({
          type: 'output' as const,
          text: `packet ${String(i + 1).padStart(3, '0')} ok`,
        }))}
        input
      />
    );
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
