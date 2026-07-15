import { Progress } from 'cyberdesign';

const Frame = ({ children, max = 480 }: any) => (
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

const Row = ({ label, children }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cd-text-secondary)' }}>{label}</span>
    {children}
  </div>
);

export const Values = () => (
  <Frame>
    <Row label="Upload — 24%"><Progress value={24} /></Row>
    <Row label="Sync — 58%"><Progress value={58} /></Row>
    <Row label="Index — 91%"><Progress value={91} thick /></Row>
  </Frame>
);

export const Variants = () => (
  <Frame>
    <Row label="Complete — success"><Progress value={100} variant="success" /></Row>
    <Row label="Disk 82% — warning"><Progress value={82} variant="warning" /></Row>
    <Row label="Error rate 47% — danger"><Progress value={47} variant="danger" /></Row>
    <Row label="Scanning — indeterminate"><Progress indeterminate /></Row>
  </Frame>
);
