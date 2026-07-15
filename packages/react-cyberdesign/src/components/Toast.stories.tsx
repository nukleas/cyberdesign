import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';
import { ToasterProvider, useToast } from './Toaster';
import { Button } from './Button';

const meta = {
  title: 'Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error', 'accent'],
    },
  },
  args: {
    variant: 'info',
    title: 'Uplink',
    children: 'Channel established on port 443.',
    icon: 'ℹ',
  },
} satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Success: Story = {
  args: { variant: 'success', title: 'Deployed', icon: '✓', children: 'Build #91 live.' },
};
export const Error: Story = {
  args: { variant: 'error', title: 'Auth failed', icon: '✕', children: 'Token expired.' },
};
export const Dismissible: Story = {
  args: { onDismiss: () => {}, title: 'Dismiss me', children: 'Click ✕' },
};

function ToastDemo() {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button size="sm" onClick={() => toast({ title: 'Info', children: 'Queued.', variant: 'info', icon: 'ℹ' })}>
        Info
      </Button>
      <Button size="sm" variant="primary" onClick={() => toast({ title: 'OK', children: 'Saved.', variant: 'success', icon: '✓' })}>
        Success
      </Button>
      <Button size="sm" variant="danger" onClick={() => toast({ title: 'Fail', children: 'Retry.', variant: 'error', icon: '✕' })}>
        Error
      </Button>
    </div>
  );
}

export const ToasterStack: Story = {
  name: 'Toaster (Sonner-style)',
  render: () => (
    <ToasterProvider position="bottom-right" duration={3500}>
      <ToastDemo />
    </ToasterProvider>
  ),
};
