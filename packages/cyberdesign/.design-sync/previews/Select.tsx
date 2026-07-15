import { Select } from 'cyberdesign';

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

export const Variants = () => (
  <Frame>
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lbl('Feed category')}
      <Select defaultValue="Crime">
        <option value="">Choose option…</option>
        <option>Crime</option>
        <option>Weather</option>
        <option>Transit</option>
        <option>Fire</option>
      </Select>
    </label>
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lbl('Uppercase label variant')}
      <Select label defaultValue="ALL CATEGORIES">
        <option>ALL CATEGORIES</option>
        <option>GOVERNMENT</option>
        <option>EVENTS</option>
      </Select>
    </label>
  </Frame>
);

export const SizeAndError = () => (
  <Frame>
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lbl('Small — time range')}
      <Select size="sm">
        <option>Last 24h</option>
        <option>Last 7d</option>
        <option>Last 30d</option>
      </Select>
    </label>
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lbl('Region — error')}
      <Select error defaultValue="">
        <option value="">No region selected…</option>
        <option>us-east-1</option>
        <option>eu-west-2</option>
      </Select>
      <span style={{ fontSize: 10, color: 'var(--cd-red)' }}>A region is required.</span>
    </label>
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lbl('Disabled')}
      <Select disabled defaultValue="48000 Hz">
        <option>44100 Hz</option>
        <option>48000 Hz</option>
        <option>96000 Hz</option>
      </Select>
    </label>
  </Frame>
);
