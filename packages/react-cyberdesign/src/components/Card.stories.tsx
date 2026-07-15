import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
} from './Card';
import { Button } from './Button';
import { Badge } from './Badge';

const meta = {
  title: 'Surfaces/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    glow: { control: 'boolean', table: { category: 'Appearance' } },
  },
  args: { glow: true },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args: CardProps) => (
    <Card {...args} style={{ width: 360 }}>
      <CardHeader row>
        <div>
          <CardTitle>Uplink node</CardTitle>
          <CardDescription>Encrypted tunnel status and throughput.</CardDescription>
        </div>
        <Badge color="green">LIVE</Badge>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0, color: 'var(--cd-text-secondary)', fontSize: 12 }}>
          p50 42ms · p99 180ms · packet loss 0.01%
        </p>
      </CardContent>
      <CardFooter end>
        <Button size="sm">Details</Button>
        <Button size="sm" variant="primary">
          Connect
        </Button>
      </CardFooter>
    </Card>
  ),
};
