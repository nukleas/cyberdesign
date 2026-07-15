import type { Meta, StoryObj } from '@storybook/react';
import {
  Typography,
  H1,
  H2,
  H3,
  H4,
  P,
  Lead,
  Muted,
  Small,
  InlineCode,
  Pre,
  Blockquote,
  List,
  InlineLink,
} from './Typography';

const meta = {
  title: 'Primitives/Typography',
  component: Typography,
  tags: ['autodocs'],
} satisfies Meta<typeof Typography>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  render: () => (
    <Typography style={{ maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <H1>OCINT</H1>
      <H2>Situation room</H2>
      <H3>Harbor sector</H3>
      <H4>Telemetry</H4>
      <Lead>Live civic intelligence for Orange County operators.</Lead>
      <P>
        Ingest pipelines normalize crime, fire, weather, and port feeds into a single terminal
        surface. Query with <InlineCode>near:me</InlineCode> or open the{' '}
        <InlineLink href="#">command palette</InlineLink>.
      </P>
      <Muted>Secondary helper copy sits here.</Muted>
      <Small>META · v0.1</Small>
      <Blockquote>Wake up, operator — we have a city to watch.</Blockquote>
      <List>
        <li>Dashboard</li>
        <li>Dossiers</li>
        <li>Dispatch</li>
      </List>
      <Pre>{`s("bd sd").bank("RolandTR909")`}</Pre>
    </Typography>
  ),
};
