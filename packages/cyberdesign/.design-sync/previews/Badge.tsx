import { Badge } from 'cyberdesign';

const Frame = ({ children, max = 560 }: any) => (
  <div
    className="theme-orange"
    style={{
      background: 'var(--cd-bg)',
      color: 'var(--cd-text)',
      fontFamily: 'var(--cd-font-mono)',
      padding: 24,
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      alignItems: 'center',
      maxWidth: max,
    }}
  >
    {children}
  </div>
);

export const Colors = () => (
  <Frame>
    <Badge color="orange">orange</Badge>
    <Badge color="amber">amber</Badge>
    <Badge color="gold">gold</Badge>
    <Badge color="cyan">cyan</Badge>
    <Badge color="magenta">magenta</Badge>
    <Badge color="green">green</Badge>
    <Badge color="red">red</Badge>
    <Badge color="blue">blue</Badge>
    <Badge color="purple">purple</Badge>
    <Badge color="yellow">yellow</Badge>
  </Frame>
);

export const StatusUsage = () => (
  <Frame max={420}>
    <Badge color="green">● online</Badge>
    <Badge color="amber">◐ degraded</Badge>
    <Badge color="red">✕ offline</Badge>
    <Badge color="cyan">⬡ syncing</Badge>
    <Badge color="purple">v2.4.1</Badge>
    <Badge color="magenta">beta</Badge>
  </Frame>
);
