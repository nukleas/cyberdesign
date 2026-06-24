import { Textarea } from 'cyberdesign';

const Frame = ({ children, max = 460 }: any) => (
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

export const Default = () => (
  <Frame>
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lbl('Incident notes')}
      <Textarea
        rows={4}
        placeholder="Describe the anomaly…"
        defaultValue={'14:52:11 — anomalous packet spike on eth0\nFailover initiated to standby node.'}
      />
      <span style={{ fontSize: 10, color: 'var(--cd-text-dim)' }}>Supports vertical resize. Max 500 characters.</span>
    </label>
  </Frame>
);

export const Error = () => (
  <Frame>
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lbl('Webhook payload — invalid JSON')}
      <Textarea error rows={4} defaultValue={'{ "event": "breach", node: 7 '} />
      <span style={{ fontSize: 10, color: 'var(--cd-red)' }}>Unexpected token — payload must be valid JSON.</span>
    </label>
  </Frame>
);

export const Disabled = () => (
  <Frame>
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lbl('System log — read only')}
      <Textarea
        disabled
        rows={4}
        defaultValue={'[ OK ] mounted /dev/sda1\n[ OK ] network bridge up\n[WARN] thermal sensor 3 offline'}
      />
    </label>
  </Frame>
);
