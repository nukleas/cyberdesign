import { Slider } from 'cyberdesign';

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
      gap: 16,
      maxWidth: max,
    }}
  >
    {children}
  </div>
);

const lbl = (text: string) => (
  <span style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--cd-text-muted)' }}>{text}</span>
);

export const WithValue = () => (
  <Frame>
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {lbl('Gain')}
      <Slider min={0} max={127} defaultValue={74} valueLabel="74" />
    </label>
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {lbl('Threshold')}
      <Slider min={0} max={100} defaultValue={88} valueLabel="88%" />
    </label>
  </Frame>
);

export const States = () => (
  <Frame>
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {lbl('Sample rate (default)')}
      <Slider min={0} max={100} defaultValue={40} />
    </label>
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {lbl('Locked — disabled')}
      <Slider min={0} max={100} defaultValue={60} disabled valueLabel="60" />
    </label>
  </Frame>
);
