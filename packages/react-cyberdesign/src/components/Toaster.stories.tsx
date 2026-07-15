import type { Meta, StoryObj } from '@storybook/react';
import { ToasterProvider, useToast } from './Toaster';
import { Button } from './Button';

const meta = {
  title: 'Feedback/Toaster',
  component: ToasterProvider,
  tags: ['autodocs'],
} satisfies Meta<typeof ToasterProvider>;
export default meta;
type Story = StoryObj<typeof meta>;

function Demo() {
  const { toast } = useToast();
  return (
    <Button
      variant="primary"
      onClick={() => toast({ title: 'Queued', children: 'Job enqueued.', variant: 'accent', icon: '⬡' })}
    >
      Push toast
    </Button>
  );
}

export const Default: Story = {
  render: () => (
    <ToasterProvider position="top-right">
      <Demo />
    </ToasterProvider>
  ),
};
