import { Input } from 'cyberdesign';

const Frame = ({ children, max = 420 }: any) => (
  <div
    className="theme-orange"
    style={{
      background: 'var(--cd-bg)',
      color: 'var(--cd-text)',
      fontFamily: 'var(--cd-font-mono)',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      maxWidth: max,
    }}
  >
    {children}
  </div>
);

const lbl = (text: string) => (
  <span style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--cd-text-muted)' }}>{text}</span>
);

export const States = () => (
  <Frame>
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lbl('API Endpoint')}
      <Input placeholder="https://api.node.io/v1" defaultValue="https://api.node.io/v1" />
    </label>
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lbl('Accent border')}
      <Input accent placeholder="corpus-search query…" />
    </label>
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lbl('Auth token — error')}
      <Input error defaultValue="sk-invalid-key" />
      <span style={{ fontSize: 10, color: 'var(--cd-red)' }}>Token rejected by upstream.</span>
    </label>
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lbl('Disabled')}
      <Input disabled defaultValue="locked@edge.node" />
    </label>
  </Frame>
);

export const Sizes = () => (
  <Frame>
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lbl('Small')}
      <Input size="sm" placeholder="Compact filter…" />
    </label>
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lbl('Medium (default)')}
      <Input placeholder="Search nodes…" />
    </label>
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lbl('Large')}
      <Input size="lg" placeholder="Primary command input…" />
    </label>
  </Frame>
);
