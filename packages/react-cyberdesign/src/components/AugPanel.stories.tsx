import type { Meta, StoryObj } from '@storybook/react';
import { AugPanel, type AugPanelProps } from './AugPanel';
import { AugButton } from './AugButton';

const meta = {
  title: 'Cyber/AugPanel',
  component: AugPanel,
  tags: ['autodocs'],
} satisfies Meta<typeof AugPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args: AugPanelProps) => (
    <AugPanel {...args} style={{ width: 280, padding: 16 }}>
      <div style={{ fontSize: 12, marginBottom: 10, color: 'var(--cd-text-secondary)' }}>
        Augmented clip-path surface.
      </div>
      <AugButton variant="primary" size="sm">Engage</AugButton>
    </AugPanel>
  ),
};
