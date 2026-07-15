import { Switch } from 'cyberdesign';

const Frame = ({ children, max = 360 }: any) => (
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

export const States = () => (
  <Frame>
    <Switch label="Off by default" />
    <Switch label="Telemetry enabled" defaultChecked />
    <Switch label="Auto-refresh feed" defaultChecked />
    <Switch label="Maintenance mode (disabled)" disabled />
  </Frame>
);

export const Small = () => (
  <Frame>
    <Switch size="sm" label="Compact — dark mode" defaultChecked />
    <Switch size="sm" label="Compact — sound alerts" />
    <Switch size="sm" label="Compact — locked" defaultChecked disabled />
  </Frame>
);
