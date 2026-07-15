import type { Meta, StoryObj } from '@storybook/react';
import { AugButton } from './AugButton';
import { AugPanel } from './AugPanel';

const meta = {
  title: 'Cyber/AugButton',
  component: AugButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'primary'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { children: 'Engage', variant: 'primary' },
} satisfies Meta<typeof AugButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Reverse: Story = { args: { reverse: true, children: 'Reverse clip' } };
export const Panel: Story = {
  name: 'AugPanel',
  render: () => (
    <AugPanel style={{ width: 280, padding: 16 }}>
      <div style={{ fontSize: 12, color: 'var(--cd-text-secondary)' }}>
        Clip-path panel with neon drop shadow — pair with AugButton for AR chrome.
      </div>
      <div style={{ marginTop: 12 }}>
        <AugButton variant="primary" size="sm">
          Confirm
        </AugButton>
      </div>
    </AugPanel>
  ),
};
