import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from './AspectRatio';

const meta = {
  title: 'Layout/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
} satisfies Meta<typeof AspectRatio>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Widescreen: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <AspectRatio ratio={16 / 9}>
        <div
          style={{
            background: 'var(--cd-bg-panel)',
            border: '1px solid var(--cd-border)',
            display: 'grid',
            placeItems: 'center',
            color: 'var(--cd-accent)',
            fontSize: 12,
          }}
        >
          16:9
        </div>
      </AspectRatio>
    </div>
  ),
};
