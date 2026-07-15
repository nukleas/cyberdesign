import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';
import { H3, P } from './Typography';

const meta = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Cyber OS',
    links: [
      { label: 'Dashboard', icon: '▣', active: true },
      { label: 'Nodes', icon: '⬡' },
      { label: 'Logs', icon: '☰' },
      { label: 'Settings', icon: '⚙' },
    ],
    children: (
      <div>
        <H3>Dashboard</H3>
        <P style={{ marginTop: 8 }}>Main content area beside the collapsible sidebar.</P>
      </div>
    ),
    style: { width: 640, minHeight: 320 },
  },
};
