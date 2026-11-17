import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

/**
 * Toggle switch: a native checkbox with `role="switch"`, visually hidden but
 * still in the Tab order; the track shows the focus ring.
 *
 * | Key | Action |
 * | --- | --- |
 * | Tab | Focus the switch |
 * | Space | Toggle on / off |
 */
const meta = {
  title: 'Form/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
  },
  args: { label: 'Auto-deploy', defaultChecked: true, size: 'md' },
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: 'sm', label: 'Compact' } };
export const Off: Story = { args: { defaultChecked: false, label: 'Standby' } };
