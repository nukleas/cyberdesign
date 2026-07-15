import { Separator } from 'cyberdesign';

const Frame = ({ children, max = 440 }: any) => (
  <div
    className="theme-orange"
    style={{
      background: 'var(--cd-bg)',
      color: 'var(--cd-text)',
      fontFamily: 'var(--cd-font-mono)',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      maxWidth: max,
    }}
  >
    {children}
  </div>
);

const txt = (s: string) => (
  <span style={{ fontSize: 11, color: 'var(--cd-text-secondary)' }}>{s}</span>
);

export const HorizontalAndLabel = () => (
  <Frame>
    {txt('SESSION ACTIVE')}
    <Separator />
    {txt('Neon gradient divider:')}
    <Separator neon />
    <Separator>or</Separator>
    <Separator neon>continue with key</Separator>
  </Frame>
);

export const Vertical = () => (
  <Frame max={360}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 28 }}>
      {txt('192.168.7.44')}
      <Separator orientation="vertical" />
      {txt('LATENCY 12ms')}
      <Separator orientation="vertical" neon />
      {txt('UP 4d 7h')}
    </div>
  </Frame>
);
