import { useEffect, useRef, useState } from 'react';
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

function DownloadDemo() {
  const { toast, update, dismiss } = useToast();
  const [running, setRunning] = useState(false);
  const tick = useRef<number | undefined>(undefined);

  const stop = () => {
    window.clearInterval(tick.current);
    setRunning(false);
  };
  useEffect(() => () => window.clearInterval(tick.current), []);

  const start = () => {
    let percent = 0;
    const id = toast({
      variant: 'accent',
      icon: '⬇',
      title: 'Downloading sample pack',
      children: '0%',
      progress: 0,
      duration: 0,
      actions: (
        <Button
          size="sm"
          onClick={() => {
            stop();
            dismiss(id);
          }}
        >
          Cancel
        </Button>
      ),
    });
    setRunning(true);
    tick.current = window.setInterval(() => {
      percent += 4;
      if (percent < 100) {
        update(id, { children: `${percent}%`, progress: percent });
        return;
      }
      stop();
      update(id, {
        variant: 'success',
        icon: '✓',
        title: 'Download complete',
        children: 'Sample pack installed.',
        progress: undefined,
        actions: undefined,
        duration: 4000,
      });
    }, 200);
  };

  return (
    <Button variant="primary" disabled={running} onClick={start}>
      Download sample pack
    </Button>
  );
}

/**
 * A long job: `toast({ duration: 0 })` keeps the toast up, `update(id, …)` moves its text and
 * bar in place, and a last `update` turns it into a success toast that auto-dismisses.
 */
export const Download: Story = {
  name: 'Long job (download)',
  render: () => (
    <ToasterProvider>
      <DownloadDemo />
    </ToasterProvider>
  ),
};
